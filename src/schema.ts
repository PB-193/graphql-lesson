// GraphQL スキーマ定義
export const typeDefs = `#graphql
  # ユーザー型
  type User {
    id: Int!
    email: String!
    name: String!
    posts: [Post!]!
    createdAt: String!
    updatedAt: String!
  }

  # 投稿型
  type Post {
    id: Int!
    title: String!
    content: String
    published: Boolean!
    author: User!
    authorId: Int!
    createdAt: String!
    updatedAt: String!
  }

  # Query（データ取得）
  type Query {
    # 全ユーザー取得
    users: [User!]!
    # 特定のユーザー取得
    user(id: Int!): User
    # 全投稿取得
    posts: [Post!]!
    # 特定の投稿取得
    post(id: Int!): Post
  }

  # Mutation（データ変更）
  type Mutation {
    # ユーザー作成
    createUser(email: String!, name: String!): User!
    # ユーザー更新
    updateUser(id: Int!, email: String, name: String): User
    # ユーザー削除
    deleteUser(id: Int!): User

    # 投稿作成
    createPost(title: String!, content: String, authorId: Int!): Post!
    # 投稿更新
    updatePost(id: Int!, title: String, content: String, published: Boolean): Post
    # 投稿削除
    deletePost(id: Int!): Post
  }
`;
