#!/bin/bash
set -eo pipefail # コマンドやパイプラインが失敗したらスクリプトを終了

execute_remote() {
  echo -e "\033[34mEXECUTING:\033[0m $1"
  if ! ssh -o 'StrictHostKeyChecking no' ubuntu@"$DEPLOY_TARGET_SERVER1" "$1"; then
    echo -e "\033[31mCOMMAND FAILED:\033[0m $1"
    exit 1
  fi
}

check_service_status() {
  echo -e "\n\033[36mCHECKING SERVICE STATUS...\033[0m"
  local status_output=$(execute_remote "sudo pm2 status /var/www/nodejs/rics.ecosystem.config.js --no-color" || true)
  
  # サービス状态检查
  if grep -q 'online' <<< "$status_output"; then
    echo -e "\033[32mSERVICE IS RUNNING\033[0m"
    return 0
  elif grep -q 'stopped' <<< "$status_output"; then
    echo -e "\033[33mSERVICE IS STOPPED\033[0m"
    return 1
  else
    echo -e "\033[33mSERVICE NOT FOUND\033[0m"
    return 2
  fi
}

deploy_sequence() {
  echo -e "\n\033[36mSTARTING DEPLOYMENT PROCESS\033[0m"
  
  # サービス状態によって、停止または次の操作を実行
  if check_service_status; then
    echo -e "\n\033[34mSTOPPING RUNNING SERVICE...\033[0m"
    execute_remote "sudo pm2 stop /var/www/nodejs/rics.ecosystem.config.js"
  fi

  # 資材アップロード
  echo -e "\n\033[34mUPLOADING ARTIFACT...\033[0m"
  scp -o 'StrictHostKeyChecking no' ./rics_output.zip ubuntu@"$DEPLOY_TARGET_SERVER1":/var/www/nodejs/

  # デプロイ
  execute_remote "sudo rm -rf /var/www/nodejs/rics"
  execute_remote "sudo unzip -o /var/www/nodejs/rics_output.zip -d /var/www/nodejs/"
  execute_remote "sudo mv /var/www/nodejs/rics_output /var/www/nodejs/rics"
  execute_remote "sudo chown -R rics:rics /var/www/nodejs/rics"
  execute_remote "sudo chmod -R 755 /var/www/nodejs/rics"

  # サービス再起動
  echo -e "\n\033[34mRESTARTING SERVICE...\033[0m"
  execute_remote "sudo pm2 start /var/www/nodejs/rics.ecosystem.config.js"
}

# メイン処理
{
  check_service_status
  deploy_sequence
  check_service_status
  echo -e "\n\033[32mDEPLOYMENT COMPLETED SUCCESSFULLY\033[0m"
} || {
  echo -e "\n\033[31mDEPLOYMENT FAILED! \033[0m"
  exit 1
}