#!/usr/bin/env bash
# =============================================================
# RICS 実家じまい POC 起動スクリプト
# =============================================================
# 起動するサービス:
#   [8080] mock-api     — Node.js + SQLite  (Spring Boot の代替)
#   [3000] 静的サーバー  — Python http.server (admin.html + akicon)
# =============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       RICS 実家じまい POC 起動スクリプト             ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ─── Node.js チェック ─────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "❌ Node.js が見つかりません。インストールしてください。"
  exit 1
fi
echo "✅ Node.js: $(node -v)"
echo "✅ Python:  $(python3 --version)"

# ─── mock-api 依存インストール ────────────────────────────
echo ""
echo "📦 mock-api: 依存パッケージをインストール中..."
cd "$SCRIPT_DIR/mock-api"
npm install --silent
echo "✅ mock-api: 依存パッケージ完了"

# ─── mock-api 起動 ────────────────────────────────────────
echo ""
echo "🚀 mock-api 起動中 (port 8080)..."
node server.js > "$LOG_DIR/mock-api.log" 2>&1 &
MOCK_PID=$!
echo "   PID: $MOCK_PID"
sleep 2
if ! kill -0 $MOCK_PID 2>/dev/null; then
  echo "❌ mock-api の起動に失敗しました。ログ:"
  cat "$LOG_DIR/mock-api.log"
  exit 1
fi
echo "✅ mock-api 起動完了: http://localhost:8080"

# ─── 静的ファイルサーバー起動 ─────────────────────────────
echo ""
echo "🚀 静的ファイルサーバー起動中 (port 3000)..."
cd "$SCRIPT_DIR"
python3 -m http.server 3000 --bind 0.0.0.0 > "$LOG_DIR/static.log" 2>&1 &
STATIC_PID=$!
echo "   PID: $STATIC_PID"
sleep 1
echo "✅ 静的サーバー起動完了: http://localhost:3000"

# ─── PID 保存 ─────────────────────────────────────────────
echo "$MOCK_PID"   > "$LOG_DIR/mock-api.pid"
echo "$STATIC_PID" > "$LOG_DIR/static.pid"

# ─── 起動完了メッセージ ───────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  🎉  POC 起動完了！                                  ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║                                                      ║"
echo "║  管理画面                                            ║"
echo "║    http://localhost:3000/admin.html                  ║"
echo "║    ログイン: admin@rics.co.jp / password123          ║"
echo "║                                                      ║"
echo "║  顧客フォーム (akicon)                               ║"
echo "║    http://localhost:3000/akicon/index.html           ║"
echo "║                                                      ║"
echo "║  mock-API                                            ║"
echo "║    http://localhost:8080/health                      ║"
echo "║                                                      ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  停止: bash stop.sh  または  Ctrl+C                  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Ctrl+C で両プロセスを終了
trap "echo ''; echo '🛑 POC を停止します...'; kill $MOCK_PID $STATIC_PID 2>/dev/null; echo '✅ 停止完了'; exit 0" INT TERM

wait
