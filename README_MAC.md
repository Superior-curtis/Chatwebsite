README for Mac — self-host LiteLLM/Ollama + proxy + cloudflared

目的：
- 在 Mac 上啟動本機模型服務（Ollama 或 LiteLLM Docker），並啟動 Node SSE 代理（llama_local_tools），再用 cloudflared 暴露公開網址供測試。
- 這樣前端可指向公開代理或直接指向本機代理。
- 完全免費且不受第三方 API 次數限制，但受你 Mac 的硬體限制（CPU/GPU/記憶體/網路）。

快速開始（步驟）
1) 下載或複製 repo 至 Mac：
   cd ~
   git clone https://github.com/Superior-curtis/Chatwebsite.git Chatwebsite

2) 把腳本放到 repo（若已存在）
   cd ~/Chatwebsite
   chmod +x setup_mac.sh

3) 執行 setup 腳本（會啟動 Ollama（如已安裝）、啟動代理，並嘗試啟動 cloudflared 隧道）
   ./setup_mac.sh

4) 若 cloudflared 要求授權，執行：
   cloudflared tunnel login
   然後重啟隧道：
   pkill -f cloudflared || true
   nohup cloudflared tunnel --url "http://localhost:3000" >/tmp/chatwebsite_setup_logs/tunnel.log 2>&1 &

5) 測試本機代理（在另一個 terminal）：
   curl -v -N -H "Content-Type: application/json" \
     -d '{"model":"gemma4","messages":[{"role":"user","content":"Hello"}],"stream":true}' \
     http://127.0.0.1:3000/api/chat

6) 部署前端到 Vercel（免費層）
   cd ~/Chatwebsite
   npx vercel login
   npx vercel --prod

注意事項：
- 若要讓 Vercel 前端呼叫你本機模型，必須提供一個公開的代理/Worker（cloudflared trycloudflare 或 Cloudflare Worker）。
- 長期穩定與多使用者同時使用需雲端伺服器（非免費）。

VS Code Copilot 指示（可直接貼入 Copilot 或 Mac 終端）

> 請在 Mac 的 VS Code 終端執行 `./setup_mac.sh`，完成後把以下日誌貼回：
> - /tmp/chatwebsite_setup_logs/ollama_serve.log
> - /tmp/chatwebsite_setup_logs/proxy.log
> - /tmp/chatwebsite_setup_logs/tunnel.log

如果你要我替你在 Mac 自動執行並檢查日誌，回覆： `RunOnMac`。
