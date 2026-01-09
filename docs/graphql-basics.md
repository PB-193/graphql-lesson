# GraphQL 入門ガイド（初学者向け）

## GraphQL とは？

GraphQL（グラフキューエル）は、**APIのためのクエリ言語**です。
2015年にFacebook（現Meta）が開発し、オープンソースとして公開しました。

簡単に言うと、「**欲しいデータを、欲しい形で取得できる仕組み**」です。

---

## なぜ GraphQL が生まれたの？

### REST API の課題

従来のREST APIでは、以下のような問題がありました。

```
例：ユーザー情報とその投稿一覧を取得したい場合

REST APIの場合:
1回目: GET /users/1        → ユーザー情報を取得
2回目: GET /users/1/posts  → 投稿一覧を取得

→ 2回のリクエストが必要
```

**問題点:**
- **オーバーフェッチ**: 不要なデータまで取得してしまう
- **アンダーフェッチ**: 1回で必要なデータが取れず、複数回リクエストが必要
- **エンドポイントの増加**: 機能が増えるたびにURLが増える

### GraphQL の解決策

```graphql
# GraphQLなら1回のリクエストで取得可能
query {
  user(id: 1) {
    name
    email
    posts {
      title
    }
  }
}
```

**メリット:**
- 必要なデータだけを指定して取得
- 1回のリクエストで完結
- エンドポイントは1つだけ

---

## REST API vs GraphQL 比較表

| 項目 | REST API | GraphQL |
|------|----------|---------|
| エンドポイント | 複数（/users, /posts, etc.） | **1つ**（/graphql） |
| データ取得 | サーバーが決めた形式 | **クライアントが指定** |
| HTTPメソッド | GET, POST, PUT, DELETE | **POST のみ**（基本） |
| レスポンス | 固定 | **柔軟** |
| 学習コスト | 低い | やや高い |

---

## GraphQL の3つの操作

### 1. Query（クエリ）- データの取得

データを**読み取る**ときに使います。REST APIの`GET`に相当します。

```graphql
# すべてのユーザーを取得
query {
  users {
    id
    name
    email
  }
}
```

```graphql
# 特定のユーザーを取得
query {
  user(id: "1") {
    name
    posts {
      title
      content
    }
  }
}
```

### 2. Mutation（ミューテーション）- データの変更

データを**作成・更新・削除**するときに使います。REST APIの`POST`, `PUT`, `DELETE`に相当します。

```graphql
# 新しいユーザーを作成
mutation {
  createUser(name: "田中太郎", email: "tanaka@example.com") {
    id
    name
  }
}
```

```graphql
# ユーザー情報を更新
mutation {
  updateUser(id: "1", name: "田中次郎") {
    id
    name
  }
}
```

```graphql
# ユーザーを削除
mutation {
  deleteUser(id: "1") {
    id
  }
}
```

### 3. Subscription（サブスクリプション）- リアルタイム通信

データの変更を**リアルタイムで受け取る**ときに使います。チャットアプリなどで活用されます。

```graphql
# 新しいメッセージをリアルタイムで受信
subscription {
  newMessage {
    id
    content
    sender {
      name
    }
  }
}
```

---

## スキーマとは？

スキーマは、GraphQL APIの**設計図**です。
どんなデータがあり、どんな操作ができるかを定義します。

### 型定義（Type Definition）

```graphql
# ユーザーの型を定義
type User {
  id: ID!          # ! は必須（null不可）を意味する
  name: String!
  email: String!
  age: Int
  posts: [Post!]!  # Post型の配列
}

# 投稿の型を定義
type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}
```

### 基本的な型

| 型 | 説明 | 例 |
|----|------|-----|
| `String` | 文字列 | "Hello" |
| `Int` | 整数 | 42 |
| `Float` | 小数 | 3.14 |
| `Boolean` | 真偽値 | true / false |
| `ID` | 一意の識別子 | "user_123" |

### 特殊な記号

- `!` - 必須（nullを許可しない）
- `[]` - 配列

```graphql
String    # null または 文字列
String!   # 必ず文字列（null不可）
[String]  # null または 文字列の配列
[String!]! # 必ず文字列の配列（配列も各要素もnull不可）
```

---

## リゾルバーとは？

リゾルバーは、GraphQLクエリを**実際のデータに変換する関数**です。

```
クエリが来たら → リゾルバーが動いて → データを返す
```

### 例

```typescript
// リゾルバーの例
const resolvers = {
  Query: {
    // users クエリが来たら、全ユーザーを返す
    users: () => {
      return database.findAllUsers();
    },
    // user(id) クエリが来たら、特定ユーザーを返す
    user: (_, { id }) => {
      return database.findUserById(id);
    },
  },
  Mutation: {
    // createUser ミューテーションが来たら、ユーザーを作成
    createUser: (_, { name, email }) => {
      return database.createUser({ name, email });
    },
  },
};
```

---

## GraphQL の動作イメージ

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   クライアント   │  ──→  │  GraphQL    │  ──→  │  データベース   │
│   (React等)   │  ←──  │   サーバー    │  ←──  │             │
└─────────────┘         └─────────────┘         └─────────────┘
     │                        │
     │ query {               │ リゾルバーが
     │   user(id:1) {        │ クエリを解析して
     │     name              │ 必要なデータを取得
     │   }                   │
     │ }                     │
     ↓                        ↓
  クエリを送信            データを返却
```

---

## よく使うツール

### サーバー側
- **Apollo Server** - 最も人気のあるGraphQLサーバー
- **GraphQL Yoga** - シンプルで使いやすい
- **Prisma** - データベースとの連携を簡単に

### クライアント側
- **Apollo Client** - React等で使える高機能クライアント
- **urql** - 軽量なGraphQLクライアント

### 開発ツール
- **GraphQL Playground** - ブラウザでクエリをテストできる
- **Apollo Studio** - APIの監視・管理

---

## まとめ

| 概念 | 説明 |
|------|------|
| GraphQL | APIのためのクエリ言語 |
| Query | データを取得する |
| Mutation | データを変更する |
| Subscription | リアルタイムでデータを受信 |
| スキーマ | APIの設計図（型定義） |
| リゾルバー | クエリをデータに変換する関数 |

---

## 次のステップ

1. 実際にGraphQLサーバーを構築してみる
2. GraphQL Playgroundでクエリを実行してみる
3. Reactからデータを取得してみる

→ [学習フロー](./learning-flow.md) に沿って進めましょう！
