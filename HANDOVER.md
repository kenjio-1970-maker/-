# RICS 実家じまい CRM v2 — 引き継ぎドキュメント

## プロジェクト概要

**プロジェクト名**: RICS 実家じまい CRM v2
**デプロイ先**: https://rics-crm.vercel.app/jikka-crm-v2.html
**リポジトリ**: GitHub → Vercel 自動デプロイ
**作成日**: 2026-03-20

---

## v2 で追加した機能

| 機能 | 説明 |
|------|------|
| **ABCDE判定** | 案件の優先度・見込み度をA〜Eの5段階で自動スコアリング |
| **アキコン連携** | アキコン（空き家コンサル）への問い合わせフォーム連携 |
| **いえやす君連携** | いえやす君（不動産査定AI）への査定依頼連携 |

---

## データ構造

### 案件（Lead）オブジェクト

```json
{
  "id": "uuid",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "client_name": "string",
  "client_phone": "string",
  "client_email": "string",
  "property_address": "string",
  "property_type": "戸建て|マンション|土地",
  "situation": "string（状況メモ）",
  "abcde_rank": "A|B|C|D|E",
  "abcde_score": "number（0-100）",
  "abcde_reason": "string（判定根拠）",
  "akicon_status": "未連携|連携済み|回答待ち|完了",
  "akicon_inquiry_id": "string|null",
  "ieyasu_status": "未連携|依頼済み|査定完了",
  "ieyasu_estimate": "number|null（万円）",
  "stage": "新規|ヒアリング中|提案中|契約|失注",
  "memo": "string",
  "tags": ["string"]
}
```

### ABCDE判定ロジック

| ランク | スコア範囲 | 意味 |
|--------|-----------|------|
| A | 80-100 | 即契約見込み・最優先対応 |
| B | 60-79 | 高確度・早期フォロー要 |
| C | 40-59 | 要育成・定期接触 |
| D | 20-39 | 長期案件・低優先 |
| E | 0-19 | 失注リスク高・要再検討 |

**スコアリング要素**:
- 物件の空き家期間（長いほど高スコア）
- 相談者の決定権の有無
- 遠方在住フラグ
- 兄弟・相続人の合意状況
- 問い合わせ経路（直電 > Web > 紹介）

---

## 外部サービス連携

### アキコン（空き家コンサル）

- **目的**: 空き家活用の専門相談窓口への送客
- **連携方式**: フォームPOST / Webhook
- **必要パラメータ**: `client_name`, `property_address`, `situation`
- **レスポンス**: `inquiry_id`（連携IDとして保存）

### いえやす君（不動産査定AI）

- **目的**: 物件の自動AI査定
- **連携方式**: REST API
- **必要パラメータ**: `property_address`, `property_type`
- **レスポンス**: `estimate_price`（万円単位）, `confidence`（信頼度）

---

## ファイル構成

```
rics-crm/
├── jikka-crm-v2.html     # 完成版メインファイル（単一HTMLアプリ）
├── build_v2.py           # 再ビルド用スクリプト
└── HANDOVER.md           # 本ドキュメント
```

### jikka-crm-v2.html の構造

単一HTML（Vanilla JS + TailwindCSS CDN）で構成。外部依存なし。

```
<head>  TailwindCSS CDN, フォント
<body>
  ├── ヘッダー（ロゴ・ナビ）
  ├── ダッシュボード（KPIカード）
  ├── 案件一覧テーブル（ABCDE表示・フィルタ）
  ├── 案件詳細モーダル（編集・連携ボタン）
  ├── 新規案件登録フォーム
  └── 設定パネル（API設定）
<script>
  ├── データ管理（localStorage）
  ├── ABCDE自動判定エンジン
  ├── アキコン連携ハンドラ
  └── いえやす君連携ハンドラ
```

---

## デプロイ手順

```bash
git clone https://github.com/[RICS-REPO]/rics-crm.git
cd rics-crm
cp /path/to/jikka-crm-v2.html .
git add jikka-crm-v2.html
git commit -m "feat: v2 - ABCDE判定 + アキコン連携 + いえやす君連携"
git push origin main
# → 1〜2分後に https://rics-crm.vercel.app/jikka-crm-v2.html で公開
```

---

## 拡張候補（v3以降）

- [ ] LINE通知連携（案件ステージ変更時に担当者へ自動通知）
- [ ] 日程調整連携（カレンダーAPI連携でヒアリング予約自動化）
- [ ] CSV一括インポート（既存案件データ移行）
- [ ] 担当者マルチアカウント対応
- [ ] ABCDEスコアの機械学習モデル化（成約データ蓄積後）
- [ ] Slack連携（チーム内アラート）

---

## よくある質問

**Q: データはどこに保存されますか？**
A: 現在は `localStorage`（ブラウザローカル）。本番運用ではFirebaseやSupabaseへの移行を推奨。

**Q: 複数人で使えますか？**
A: v2は単一ユーザー想定。v3でマルチアカウント対応予定。

**Q: アキコン/いえやす君の本番APIキーは？**
A: 設定パネル（⚙️アイコン）からAPIキーを入力。localStorageに保存される。

---

## 連絡先・経緯

- 開発: Claude (Anthropic) × RICS担当者
- v1: 基本CRM機能（案件管理・ステージ管理）
- v2: ABCDE判定・アキコン連携・いえやす君連携を追加
- 次回引き継ぎ時は本ドキュメントと `jikka-crm-v2.html` を新セッションに添付
