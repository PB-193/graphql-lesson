# GraphQL学習フロー

このプロジェクトは、GraphQLを理解するための学習用リポジトリです。

参考記事: [【図解解説】これ1本でGraphQLをマスターできるチュートリアル](https://qiita.com/Sicut_study/items/13c9f51c1f9683225e2e)

## 技術スタック

- **フロントエンド**: React + TypeScript
- **バックエンド**: GraphQL Server
- **ORM**: Prisma
- **データベース**: SQLite（または PostgreSQL）

---

## Phase 1: 基礎理解

### 1. 環境構築
- [ ] Node.js (v18以上推奨) のインストール
- [ ] npm または yarn のインストール
- [ ] エディタ + 拡張機能（GraphQL, Prisma）
  - **VSCode** または **Cursor**（どちらでもOK）
  - CursorはVSCodeベースなので同じ拡張機能が使える

### 2. GraphQLの基礎概念

#### REST API との違い

| 項目 | REST API | GraphQL |
|------|----------|---------|
| エンドポイント | リソースごとに複数 | 単一エンドポイント |
| データ取得 | 固定レスポンス | 必要なデータのみ指定可能 |
| オーバーフェッチ | 発生しやすい | 発生しない |
| アンダーフェッチ | 複数リクエスト必要 | 1リクエストで完結 |

#### 3つの操作タイプ

1. **Query** - データの取得（READ）
2. **Mutation** - データの変更（CREATE, UPDATE, DELETE）
3. **Subscription** - リアルタイム通信

---

## Phase 2: バックエンド構築

### 3. プロジェクト初期化
- [ ] React + TypeScript プロジェクト作成
- [ ] 必要パッケージのインストール
  - `@apollo/server`
  - `graphql`
  - `@prisma/client`
  - `prisma`

### 4. Prismaセットアップ
- [ ] `npx prisma init` で初期化
- [ ] `schema.prisma` でモデル定義
- [ ] `npx prisma migrate dev` でマイグレーション
- [ ] `npx prisma generate` でクライアント生成

### 5. GraphQLサーバー構築
- [ ] スキーマ定義（typeDefs）
  - 型定義
  - Query定義
  - Mutation定義
- [ ] リゾルバー実装
  - Query リゾルバー
  - Mutation リゾルバー
- [ ] サーバー起動設定

---

## Phase 3: フロントエンド連携

### 6. Apollo Client導入
- [ ] `@apollo/client` インストール
- [ ] ApolloProvider 設定
- [ ] GraphQL クエリ/ミューテーション作成

### 7. CRUD操作の実装
- [ ] 一覧取得（useQuery）
- [ ] 新規作成（useMutation）
- [ ] 更新（useMutation）
- [ ] 削除（useMutation）

---

## Phase 4: 完成

### 8. 動作確認
- [ ] GraphQL Playground でAPI確認
- [ ] フロントエンドからの操作確認
- [ ] エラーハンドリング確認

---

## ディレクトリ構成（予定）

```
graphql-lesson/
├── docs/                 # ドキュメント
├── src/
│   ├── server/           # GraphQLサーバー
│   │   ├── schema.ts     # スキーマ定義
│   │   ├── resolvers.ts  # リゾルバー
│   │   └── index.ts      # サーバーエントリー
│   ├── client/           # Reactフロントエンド
│   │   ├── components/
│   │   ├── graphql/      # クエリ/ミューテーション定義
│   │   └── App.tsx
│   └── prisma/
│       └── schema.prisma # Prismaスキーマ
├── package.json
└── tsconfig.json
```

---

## 参考リンク

- [GraphQL公式ドキュメント](https://graphql.org/)
- [Apollo Server ドキュメント](https://www.apollographql.com/docs/apollo-server/)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Apollo Client ドキュメント](https://www.apollographql.com/docs/react/)
