# 部署與免費執行 LiteLLM 操作手冊 (中文)

這份說明把兩件事做到：
- 將你目前的網站（Next.js / 靜態資源）用 100% 免費方式部署到網路上（建議：Vercel）。
- 在不花錢的情況下讓 LiteLLM 能被網站使用：提供「瀏覽器 WASM」與「本機執行 + Cloudflare Tunnel」兩種免費方案，並附上最小示範程式碼與流程。

---

快速前提檢查
- 你有一份 git 倉庫（若沒有，我會示範如何把現有專案推到 GitHub）。
- 網站是 Next.js/靜態站時最簡單（Vercel/Pages 原生支援）。

一、推薦：使用 Vercel（免費個人帳號）部署 Next.js

步驟（最短流程）：
1. 建立 GitHub 倉庫並 push（或把專案放在 GitHub）。
   ```powershell
   cd F:\Chatwebsite
   git init
   git add .
   git commit -m "deploy-ready"
   gh repo create your-user/your-repo --public --source=. --push
   ```
2. 在 Vercel 網站登入（用 GitHub OAuth）→ Import Project → 選剛剛的 repo → Deploy。
   - Vercel 會自動偵測 Next.js 設定並執行 build
   - 若你希望透過 CLI 部署：安裝 Vercel CLI 並登入
     ```bash
     npm i -g vercel
     vercel login
     vercel --prod
     ```

注意事項：
- 若你的網站需要 server-only API（例如 proxy 到 Ollama），Vercel 的 Serverless Functions 可處理小規模流量，免費額度有限。

二、完全免費的 LiteLLM 運行選項（二擇一）

選項 A — 瀏覽器內執行 WASM（建議先嘗試）
- 概念：把 LLM 的輕量化 WASM/quantized 模組放到前端，在使用者瀏覽器中執行推理（無需後端運算），只要託管靜態資源即可（Vercel/Pages 免費）。
- 優點：零伺服器成本、部署簡單、使用者延遲取決於本機硬體。
- 缺點：只能用非常小或高度量化的模型；模型檔案大小與瀏覽器記憶體是瓶頸。

示範整合步驟（高階範例）：
1. 選擇一個 WASM runtime（社群專案，如 ggml/llama.cpp 的 WASM 架構或 WebLLM 類項目）。
2. 把 runtime 與小型量化模型放到 `public/models/`（或由使用者本機上傳）。
3. 在前端新增最小呼叫程式碼（下面為抽象示意）：
```tsx
// pages/_app.tsx 或 app/page.tsx 中的 client code
import React from 'react'

async function loadModel() {
  // runtime 與 API 依你選的專案而異
  // 假設 runtime 提供 loadModel(url) 與 generate(prompt) 的介面
  const runtime = await import('web-llm-runtime')
  const model = await runtime.loadModel('/models/small-q4.bin')
  return model
}

export default function Page() {
  const [model, setModel] = React.useState(null)
  React.useEffect(()=>{ loadModel().then(setModel) }, [])

  const ask = async (q: string)=> {
    if(!model) return 'loading model...'
    const out = await model.generate(q, {max_tokens: 128})
    return out
  }
  // UI 呼叫 ask() 並顯示結果
}
```

實作提示：
- 模型檔建議放在公共 CDN 或 `public/models/`；若模型太大，改為讓使用者自己上傳或使用 local+Tunnel 選項。

選項 B — 本機（或自有機器）執行 LiteLLM，並用 Cloudflare Tunnel 暴露給網站
- 概念：在你自己的機器上跑 LiteLLM (例如 llama.cpp server 或 liteLLM)，再用 `cloudflared` 建立 tunnel，讓你的網站呼叫一個公開 URL（Cloudflare 會把流量轉到你的機器）。這樣部署網站本身仍然可以用 Vercel（免費），而模型在你本機運行（免費但需自備機器資源）。
- 優點：可跑較大模型、無第三方託管費用
- 缺點：須保持本機/伺服器運轉，網路延遲與可用性受限

快速步驟：
1. 在本機啟動模型 server（範例）
   ```bash
   # 假設你有一個簡單的 Flask 或 express server 包裝 llama.cpp
   python server.py --model /path/to/model.bin --port 11434
   ```
2. 安裝 cloudflared 並建立 tunnel
   ```bash
   # 下載並登入 (需 Cloudflare 帳號)
   cloudflared tunnel login
   cloudflared tunnel create my-liteml-tunnel
   cloudflared tunnel route dns my-liteml-tunnel my-subdomain.example.com
   cloudflared tunnel run my-liteml-tunnel
   ```
3. 在你的网站前端把 API endpoint 指向 `https://my-subdomain.example.com`，並調用 model server 的 API。

三、我已為你做了什麼（Repo 內變更）
- 刪除剛剛生成的影片檔（`out_landing.mp4`）。
- 在 `F:\Chatwebsite` 新增 `DEPLOY_LITELLM.md`（此文件）包含上述步驟與示例程式碼。

四、下一步（我可以代做）
- 我可以直接幫你把 repo 推上 GitHub 並用 Vercel CLI 觸發部署（需你授權 GitHub / Vercel）。
- 我可以把 WASM runtime 的最小整合範例加入專案（建立 `public/models/` 與前端 `pages/api/` 範例），並示範如何在你本地測試。這會需要你接受我新增幾個小檔案。

---

附錄：自動部署 (GitHub Actions -> Vercel)

如果你想要推送後自動部署，我已加入一個 GitHub Actions workflow (`.github/workflows/deploy_vercel.yml`)。
要啟動自動部署請在 GitHub repo 的 Secrets 設定中加入：

- `VERCEL_TOKEN` — 來自 Vercel (Account > Tokens)。
- `GITHUB_COPILOT_TOKEN` — 你的 Copilot API token（如果要啟用 /api/copilot）。
- `GITHUB_COPILOT_API_URL` — Copilot API 路徑（例如 `https://api.github.com/copilot` 或 GitHub 指定的 endpoint）。

之後 push 至 `main`（或 `master`）分支，Workflow 會安裝 `vercel` 並執行 `vercel --prod`（倚賴 `VERCEL_TOKEN`）。

安全提示：不要把 token 寫在 repo；只放在 GitHub Secrets 或 Vercel Environment。


請回覆你要我直接幫你做哪一項（自動化推 GitHub + Vercel 部署，或把 WASM LiteLLM 範例整合到專案），我就開始執行。
