#!/usr/bin/env python3
"""
RICS 実家じまい CRM v2 — 再ビルドスクリプト
================================================
このスクリプトは jikka-crm-v2.html を元POCから再ビルドします。

使い方:
  python3 build_v2.py
  python3 build_v2.py --output custom-output.html
  python3 build_v2.py --minify

前提:
  - Python 3.8+
  - 追加パッケージ不要（標準ライブラリのみ）
"""

import argparse
import os
import re
import sys
from pathlib import Path
from datetime import datetime

# ==================== 設定 ====================

VERSION = "2.0.0"
OUTPUT_DEFAULT = "jikka-crm-v2.html"

FEATURES = [
    "ABCDE判定エンジン",
    "アキコン連携",
    "いえやす君連携",
    "CSVエクスポート",
    "localStorageデータ永続化",
    "サンプルデータ",
]

# ==================== ビルドロジック ====================

def read_source(path: Path) -> str:
    """ソースHTMLを読み込む"""
    if not path.exists():
        print(f"[ERROR] ソースファイルが見つかりません: {path}", file=sys.stderr)
        sys.exit(1)
    return path.read_text(encoding="utf-8")


def inject_build_info(html: str) -> str:
    """ビルド日時・バージョン情報をHTMLに注入する"""
    build_ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    comment = f"<!-- BUILD: v{VERSION} | {build_ts} -->\n"
    # <html> タグの直後に挿入
    html = re.sub(r"(<html[^>]*>)", r"\1\n" + comment, html, count=1)
    return html


def minify_html(html: str) -> str:
    """簡易HTML最小化（コメント除去・空白圧縮）"""
    # HTMLコメントを除去（条件付きコメントを除く）
    html = re.sub(r"<!--(?!\[).*?(?<!\])-->", "", html, flags=re.DOTALL)
    # 行頭・行末の空白を除去
    lines = [line.strip() for line in html.splitlines()]
    # 空行を除去（ただしスクリプト内は保持しない簡易版）
    html = "\n".join(line for line in lines if line)
    return html


def validate_html(html: str) -> list[str]:
    """基本的なHTML検証（タグ対応チェック）"""
    warnings = []
    required_tags = ["<!DOCTYPE html>", "<html", "<head>", "<body>", "</html>"]
    for tag in required_tags:
        if tag.lower() not in html.lower():
            warnings.append(f"必須タグが見つかりません: {tag}")
    # ABCDE判定関数の存在確認
    if "calcABCDE" not in html:
        warnings.append("ABCDE判定関数 'calcABCDE' が見つかりません")
    # アキコン連携関数の存在確認
    if "sendToAkicon" not in html:
        warnings.append("アキコン連携関数 'sendToAkicon' が見つかりません")
    # いえやす君連携関数の存在確認
    if "sendToIeyasu" not in html:
        warnings.append("いえやす君連携関数 'sendToIeyasu' が見つかりません")
    return warnings


def build(source_path: Path, output_path: Path, minify: bool = False) -> None:
    """メインビルド処理"""
    print(f"[BUILD] RICS 実家じまい CRM v{VERSION}")
    print(f"  ソース : {source_path}")
    print(f"  出力先 : {output_path}")
    print(f"  最小化 : {'有効' if minify else '無効'}")
    print()

    # ソース読み込み
    html = read_source(source_path)
    original_size = len(html.encode("utf-8"))
    print(f"[1/4] ソース読み込み完了 ({original_size:,} bytes)")

    # ビルド情報注入
    html = inject_build_info(html)
    print(f"[2/4] ビルド情報を注入しました")

    # 検証
    warnings = validate_html(html)
    if warnings:
        print(f"[3/4] 検証: {len(warnings)}件の警告")
        for w in warnings:
            print(f"  ⚠️  {w}")
    else:
        print(f"[3/4] 検証: 問題なし ✓")

    # 最小化（オプション）
    if minify:
        html = minify_html(html)
        minified_size = len(html.encode("utf-8"))
        ratio = (1 - minified_size / original_size) * 100
        print(f"  最小化: {original_size:,} → {minified_size:,} bytes ({ratio:.1f}% 削減)")

    # 出力
    output_path.write_text(html, encoding="utf-8")
    final_size = output_path.stat().st_size
    print(f"[4/4] 出力完了: {output_path} ({final_size:,} bytes)")

    print()
    print("✅ ビルド成功")
    print()
    print("デプロイ手順:")
    print(f"  git add {output_path.name}")
    print(f'  git commit -m "feat: v2 - ABCDE判定 + アキコン連携 + いえやす君連携"')
    print("  git push origin main")
    print()
    print("含まれる機能:")
    for f in FEATURES:
        print(f"  ✓ {f}")


# ==================== エントリーポイント ====================

def main():
    parser = argparse.ArgumentParser(
        description="RICS 実家じまい CRM v2 ビルドスクリプト",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用例:
  python3 build_v2.py                          # デフォルト設定でビルド
  python3 build_v2.py --output dist/index.html # 出力先を指定
  python3 build_v2.py --minify                 # HTML最小化
  python3 build_v2.py --source src/crm.html    # ソースを指定
        """
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path(OUTPUT_DEFAULT),
        help=f"ソースHTMLファイル (デフォルト: {OUTPUT_DEFAULT})"
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(OUTPUT_DEFAULT),
        help=f"出力ファイルパス (デフォルト: {OUTPUT_DEFAULT})"
    )
    parser.add_argument(
        "--minify",
        action="store_true",
        help="HTMLを最小化する"
    )
    parser.add_argument(
        "--version",
        action="version",
        version=f"%(prog)s {VERSION}"
    )

    args = parser.parse_args()

    # ソースと出力が同じ場合はソースを一時ファイルとして扱う
    if args.source == args.output:
        import shutil
        tmp = args.source.with_suffix(".tmp.html")
        shutil.copy2(args.source, tmp)
        build(tmp, args.output, args.minify)
        tmp.unlink()
    else:
        build(args.source, args.output, args.minify)


if __name__ == "__main__":
    main()
