#!/usr/bin/env bash
# POC 停止スクリプト
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"

echo "🛑 RICS POC を停止します..."

for svc in mock-api static; do
  PID_FILE="$LOG_DIR/${svc}.pid"
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
      kill "$PID" && echo "  ✅ $svc (PID $PID) 停止"
    else
      echo "  ℹ️  $svc は既に停止しています"
    fi
    rm -f "$PID_FILE"
  else
    echo "  ℹ️  $svc の PID ファイルが見つかりません"
  fi
done

echo "✅ 停止完了"
