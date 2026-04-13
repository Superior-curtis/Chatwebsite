import { NextRequest } from 'next/server';

const TARGET_URL = process.env.GITHUB_COPILOT_API_URL;
const TOKEN = process.env.GITHUB_COPILOT_TOKEN;

function escapeSSE(data: string) {
  // Replace any lone '\n' with '\ndata: ' to keep SSE format per-line
  return data.replace(/\r/g, '').split('\n').map(l => `data: ${l}`).join('\n');
}

export async function POST(req: NextRequest) {
  if (!TARGET_URL || !TOKEN) {
    return new Response(JSON.stringify({ error: 'GITHUB_COPILOT_API_URL or GITHUB_COPILOT_TOKEN not set' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }

  const body = await req.json().catch(() => null);

  // Forward request to target
  const forwarded = await fetch(TARGET_URL, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  }).catch(err => null);

  if (!forwarded) {
    return new Response(JSON.stringify({ error: 'Failed to contact Copilot API' }), { status: 502, headers: { 'content-type': 'application/json' } });
  }

  // If upstream is not streaming, just forward the JSON body
  const contentType = forwarded.headers.get('content-type') || '';
  if (!contentType.includes('stream') && !contentType.includes('event-stream') && !forwarded.body) {
    const json = await forwarded.json().catch(() => null);
    return new Response(JSON.stringify(json), { status: forwarded.status, headers: { 'content-type': 'application/json' } });
  }

  // Stream response to client as SSE
  const encoder = new TextEncoder();

  const upstream = forwarded.body!.getReader();

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await upstream.read();
      if (done) {
        // send done event then close
        controller.enqueue(encoder.encode('event: done\n' + 'data: [DONE]\n\n'));
        controller.close();
        return;
      }
      try {
        const chunk = new TextDecoder().decode(value);
        // forward as token events (split lines)
        const sse = escapeSSE(chunk) + '\n\n';
        controller.enqueue(encoder.encode(`event: token\n${sse}`));
      } catch (e) {
        // on decode error, forward base64
        const b64 = Buffer.from(value).toString('base64');
        controller.enqueue(encoder.encode(`event: token\ndata: ${b64}\n\n`));
      }
    },
    cancel() {
      try { upstream.cancel(); } catch (e) { }
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

export async function GET() {
  return new Response(JSON.stringify({ ok: true, info: 'Copilot proxy active' }), { headers: { 'content-type': 'application/json' } });
}
