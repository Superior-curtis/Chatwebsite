#!/usr/bin/env bash
# setup_mac.sh
# 請在 Mac 上以 bash 執行：
#   curl -sS https://raw.githubusercontent.com/<your-repo>/setup_mac.sh | bash
# 或先下載後檢視再執行：
#   chmod +x setup_mac.sh && ./setup_mac.sh

set -euo pipefail
LOG_DIR=/tmp/chatwebsite_setup_logs
mkdir -p "$LOG_DIR"

echo "[INFO] 開始 Mac 一鍵設定腳本"

echo "\n== 檢查工具: ollama, node, npm, cloudflared, docker (非強制) ==\n"
command -v ollama >/dev/null 2>&1 || echo "ollama 未安裝：brew install ollama 或到 https://ollama.com/install" >&2
command -v node >/dev/null 2>&1 || echo "node 未安裝：建議安裝 nvm 或 brew install node" >&2
command -v npm >/dev/null 2>&1 || echo "npm 未安裝：請先安裝 Node" >&2
command -v cloudflared >/dev/null 2>&1 || echo "cloudflared 未安裝：brew install cloudflared" >&2
command -v docker >/dev/null 2>&1 || echo "docker 未安裝：若使用 LiteLLM Docker 需安裝 Docker Desktop" >&2

# 1) 啟動 Ollama（若已安裝且已載入 model）
if command -v ollama >/dev/null 2>&1; then
  echo "[STEP] 啟動 ollama serve (background)，日誌：$LOG_DIR/ollama_serve.log"
  if pgrep -f "ollama serve" >/dev/null 2>&1; then
    echo "ollama serve 似乎已在運行";
  else
    nohup ollama serve --host 127.0.0.1 --port 8080 > "$LOG_DIR/ollama_serve.log" 2>&1 &
    sleep 2
    echo "ollama serve 已啟動，查看 $LOG_DIR/ollama_serve.log";
  fi
else
  echo "[WARN] ollama 不存在：若你要使用 Ollama，請先安裝（brew install ollama）並下載 model。";
fi

# 2) 啟動本機代理（假設 repo 有 llama_local_tools）
PROXY_DIR="$HOME/Chatwebsite/llama_local_tools"
if [ -d "$PROXY_DIR" ]; then
  echo "[STEP] 在 $PROXY_DIR 安裝並啟動代理（會監聽 3000）"
  cd "$PROXY_DIR"
  npm install --no-audit --no-fund > "$LOG_DIR/npm_install.log" 2>&1 || true
  # 需要 .env 設定 LOCAL_MODEL_URL，預設為 ollama
  if [ ! -f .env ]; then
    echo "LOCAL_MODEL_URL=http://127.0.0.1:8080/v1/chat/completions" > .env
    echo "已建立 .env，LOCAL_MODEL_URL 指向 http://127.0.0.1:8080/v1/chat/completions"
  fi
  if pgrep -f "node .*proxy|npm start" >/dev/null 2>&1; then
    echo "代理似乎已在運行";
  else
    nohup npm start > "$LOG_DIR/proxy.log" 2>&1 &
    sleep 2
    echo "代理已啟動，查看 $LOG_DIR/proxy.log";
  fi
else
  echo "[WARN] 找不到 $PROXY_DIR；請把 repo clone 到 $HOME/Chatwebsite，並確保存在 llama_local_tools";
fi

# 3) 啟動 cloudflared 並輸出公開網址
if command -v cloudflared >/dev/null 2>&1; then
  echo "[STEP] 啟動 cloudflared 隧道，日誌：$LOG_DIR/tunnel.log"
  # 使用 3000 作為代理埠
  nohup cloudflared tunnel --url "http://localhost:3000" > "$LOG_DIR/tunnel.log" 2>&1 &
  echo $! > "$LOG_DIR/cloudflared.pid"
  sleep 3
  tail -n 200 "$LOG_DIR/tunnel.log" | sed -n '1,200p'
  # 嘗試擷取 trycloudflare 公開 url
  PUB_URL=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$LOG_DIR/tunnel.log" | head -n1 || true)
  if [ -n "$PUB_URL" ]; then
    echo "公開網址： $PUB_URL"
  else
    echo "未在日誌中立即找到 trycloudflare 網址；請執行 'cloudflared tunnel login'（互動式）以授權，然後重新啟動隧道。";
  fi
else
  echo "[WARN] cloudflared 未安裝，請執行：brew install cloudflared";
fi

# 4) 顯示簡易測試命令
echo "\n== 測試命令（貼到終端） =="
echo "curl -v http://127.0.0.1:3000/api/chat -H 'Content-Type: application/json' -d '{\"model\":\"gemma4\",\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}],\"stream\":true}'"

echo "\n== Vercel 部署說明（手動） =="
echo "cd ~/Chatwebsite"
echo "npx vercel login"
echo "npx vercel --prod"

echo "\n完成：檢查日誌："
echo "  $LOG_DIR/ollama_serve.log"
echo "  $LOG_DIR/proxy.log"
echo "  $LOG_DIR/tunnel.log"

echo "[DONE] 請把日誌內容貼回給我，或在需要時執行 cloudflared tunnel login 並重啟隧道。"
