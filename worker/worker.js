addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(request) {
  // Proxy endpoint to GitHub Copilot API (or other model API)
  const url = (await getSecret('GITHUB_COPILOT_API_URL')) || 'https://api.github.com/copilot/stream'
  const token = await getSecret('GITHUB_COPILOT_TOKEN')

  const init = {
    method: request.method,
    headers: {},
    body: request.body
  }

  // Forward necessary headers
  if (token) init.headers['Authorization'] = `Bearer ${token}`
  init.headers['Accept'] = 'text/event-stream, application/json, */*'
  // Copy content-type from client
  const ct = request.headers.get('content-type')
  if (ct) init.headers['content-type'] = ct

  const upstream = await fetch(url, init)

  // If upstream is not ok, return error
  if (!upstream.ok) {
    const txt = await upstream.text()
    return new Response(txt, { status: upstream.status, headers: { 'content-type': 'text/plain' } })
  }

  // Stream upstream chunks as SSE with events 'token' and 'done'
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  const reader = upstream.body.getReader()

  const encoder = new TextEncoder()

  async function pump() {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        // Send chunk as token event
        const chunkText = new TextDecoder().decode(value)
        const sse = `event: token\ndata: ${chunkText.replace(/\n/g, '\\n')}\n\n`
        await writer.write(encoder.encode(sse))
      }
      // send done
      await writer.write(encoder.encode('event: done\ndata: \n\n'))
    } catch (err) {
      // on error, write done with error
      await writer.write(encoder.encode(`event: done\ndata: ERROR: ${err.message}\n\n`))
    } finally {
      await writer.close()
    }
  }

  pump()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}

// Simple helper: get secret from environment (Workers use env bindings; for Pages you should configure secrets)
async function getSecret(name) {
  // In Workers runtime via wrangler, secrets are available via global bindings (not accessible here).
  // This function is a placeholder showing that you should bind secrets in wrangler.toml as environment variables or bindings.
  return null
}
