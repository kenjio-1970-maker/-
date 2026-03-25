#!/bin/bash
set -e # コマンドが失敗したらスクリプトを終了

echo "Building the code..."
npm install
npm run build
mv .output rics_output
zip -r rics_output.zip rics_output
echo "Compile complete."
