# DX Contest

## プロジェクト概要

DX Contest は、スタンプラリーアプリケーションです。ユーザーは観光地を訪れ、スタンプを集めることで進捗を確認し、完了証明書を取得できます。

## フォルダ構成

```
backend/
  requirements.txt
  app/
    __init__.py
    models/
      spot.py
      stamp.py
      user.py
    routes/
      auth.py
      spot.py
      stamp.py
    services/
      certificate.py
  services/
    cache.py
  tests/
db/
  init.sql
  seed_data.sql
frontend/
  components/
    SpotCard.js
    StampProgress.js
  cypress/
  lib/
    api.js
  pages/
    [id].js
    index.js
    login.js
    share.js
    stamprally.js
```

## 実行手順

### バックエンド

1. 必要な Python パッケージをインストールします。

   ```bash
   pip install -r backend/requirements.txt
   ```

2. データベースを初期化します。

   ```bash
   sqlite3 your_database_name.db < db/init.sql
   sqlite3 your_database_name.db < db/seed_data.sql
   ```

3. サーバーを起動します。
   ```bash
   python run.app
   ```
   http://localhost:5000 でアクセス

### フロントエンド

1. 必要な依存関係をインストールします。

   ```bash
   cd frontend
   npm install　#frontend/node_modulesが無かったら
   ```

2. 開発サーバーを起動します。
   ```bash
   npm run dev
   ```
   http://localhost:3000 でアクセス

## テスト(未実装)

### バックエンドのテスト

以下のコマンドでテストを実行します。

```bash
pytest backend/tests
```

### フロントエンドのテスト

以下のコマンドで Cypress を使用してテストを実行します。

```bash
cd frontend
npx cypress open
```

## 使用技術

- Python
- Flask
- SQLAlchemy
- Redis
- JavaScript
- React
- Next.js
