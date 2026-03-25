# RICS 実家じまい POC

## 概要

既存システムの改善箇所を正確に把握するための操作可能なPOCです。  
**メール送信なし・軽量構成**でエンドツーエンドのフローを再現します。

---

## システム構成

```
poc/
├── admin.html          ← 管理画面（Vanilla JS + TailwindCSS）
├── akicon/             ← 顧客フォーム（静的HTML, 13ステップ）
│   └── index.html      ← ログイン → フォーム開始
├── mock-api/           ← バックエンド代替（Node.js + SQLite）
│   ├── server.js       ← Express API サーバー
│   ├── db.js           ← SQLite DB 定義 + サンプルデータ
│   └── package.json
├── start.sh            ← 一括起動スクリプト
├── stop.sh             ← 一括停止スクリプト
└── README.md
```

---

## 起動方法

```bash
cd poc
bash start.sh
```

### アクセスURL

| サービス | URL |
|---------|-----|
| 管理画面 | http://localhost:3000/admin.html |
| akiconフォーム | http://localhost:3000/akicon/index.html |
| mock-API ヘルス | http://localhost:8080/health |

### ログイン情報

| ロール | メール | パスワード |
|-------|--------|-----------|
| 管理者 | admin@rics.co.jp | password123 |
| 担当者 | user_a@rics.co.jp | password123 |

---

## POCデータフロー

```
顧客                    mock-API (8080)           管理者
  │                          │                      │
  ├── akicon/index.html ──→  │                      │
  │   ログイン               POST /auth/login        │
  │                          ↓                      │
  ├── form01〜form13 ──────→ POST /customerInquiry/akicon
  │   アンケート回答          ↓ SQLiteに保存          │
  │                          ↓                      │
  └── thanks.html            │    ←── GET/POST /apl/inquiry_mgnt/**
                             │         admin.htmlから参照・編集
```

---

## mock-API エンドポイント一覧

### 認証
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /jikajimai/auth/login | ログイン |
| POST | /jikajimai/auth/logout | ログアウト |
| POST | /jikajimai/auth/pwd/modify | パスワード変更 |

### 問い合わせ管理
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /jikajimai/customerInquiry/akicon | akiconフォーム受信 |
| POST | /jikajimai/apl/inquiry_mgnt/page | ページング検索 |
| GET  | /jikajimai/apl/inquiry_mgnt/:id | 詳細取得 |
| PUT  | /jikajimai/apl/inquiry_mgnt | 保存・更新 |
| DELETE | /jikajimai/apl/inquiry_mgnt?id= | 削除 |

### システム管理
| メソッド | パス | 説明 |
|---------|------|------|
| POST | /jikajimai/sys/user/page | ユーザー一覧 |
| POST | /jikajimai/sys/user | ユーザー追加 |
| DELETE | /jikajimai/sys/user?id= | ユーザー削除 |
| GET  | /jikajimai/sys/role/list | ロール一覧 |
| GET  | /jikajimai/sys/code/mapping/all | コードマスタ |

---

## 軽量化の対応（メール送信削除）

本POCでは以下を意図的に**除外**しています：

- ✂️ メール送信機能（Spring Mail → 削除）
- ✂️ 帳票生成（PDFBox/POI → スキップしOK返却）
- ✂️ ファイルアップロード/ダウンロード（スタブ）
- ✂️ 外部API連携（地価データ、測量等 → スタブ）

---

## 確認すべき改善ポイント

操作しながら以下の観点で改善箇所を記録してください：

1. **akiconフォームUX**: 13ステップの入力フロー → 離脱ポイントはどこか
2. **問い合わせ一覧**: 検索・絞り込み機能の過不足
3. **ランク付け**: ABCDE判定の精度・入力項目の妥当性
4. **詳細画面**: 編集できる項目・できない項目の整理
5. **帳票送付フロー**: メール削除後の代替手段（郵送フラグ管理等）
6. **セキュリティ**: 認証フロー、トークン管理の課題
7. **データ整合性**: フォーム→DB→管理画面の項目マッピング

---

## 停止方法

```bash
bash stop.sh
```

または `Ctrl+C`

---

## 注意事項

- DBはSQLite（`mock-api/poc_data.db`）に永続化されます
- サーバー再起動後もデータは保持されます（DBファイルが存在する場合）
- DBをリセットする場合は `rm mock-api/poc_data.db` で削除後、再起動
