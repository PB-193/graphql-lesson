import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// ESMでの__dirname取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// データベース接続
const db = new Database(path.join(__dirname, "../prisma/dev.db"));

// 型定義
interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string | null;
  published: number; // SQLite stores boolean as 0/1
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

// リゾルバー定義
export const resolvers = {
  // Query リゾルバー
  Query: {
    // 全ユーザー取得
    users: () => {
      const users = db.prepare("SELECT * FROM User").all() as User[];
      return users.map((user) => ({
        ...user,
        posts: [],
      }));
    },

    // 特定のユーザー取得
    user: (_: unknown, args: { id: number }) => {
      const user = db
        .prepare("SELECT * FROM User WHERE id = ?")
        .get(args.id) as User | undefined;
      if (!user) return null;
      return { ...user, posts: [] };
    },

    // 全投稿取得
    posts: () => {
      const posts = db.prepare("SELECT * FROM Post").all() as Post[];
      return posts.map((post) => ({
        ...post,
        published: Boolean(post.published),
      }));
    },

    // 特定の投稿取得
    post: (_: unknown, args: { id: number }) => {
      const post = db
        .prepare("SELECT * FROM Post WHERE id = ?")
        .get(args.id) as Post | undefined;
      if (!post) return null;
      return { ...post, published: Boolean(post.published) };
    },
  },

  // Mutation リゾルバー
  Mutation: {
    // ユーザー作成
    createUser: (_: unknown, args: { email: string; name: string }) => {
      const now = new Date().toISOString();
      const result = db
        .prepare(
          "INSERT INTO User (email, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)"
        )
        .run(args.email, args.name, now, now);
      const user = db
        .prepare("SELECT * FROM User WHERE id = ?")
        .get(result.lastInsertRowid) as User;
      return { ...user, posts: [] };
    },

    // ユーザー更新
    updateUser: (
      _: unknown,
      args: { id: number; email?: string; name?: string }
    ) => {
      const now = new Date().toISOString();
      const updates: string[] = ["updatedAt = ?"];
      const values: (string | number)[] = [now];

      if (args.email) {
        updates.push("email = ?");
        values.push(args.email);
      }
      if (args.name) {
        updates.push("name = ?");
        values.push(args.name);
      }
      values.push(args.id);

      db.prepare(`UPDATE User SET ${updates.join(", ")} WHERE id = ?`).run(
        ...values
      );

      const user = db
        .prepare("SELECT * FROM User WHERE id = ?")
        .get(args.id) as User | undefined;
      if (!user) return null;
      return { ...user, posts: [] };
    },

    // ユーザー削除
    deleteUser: (_: unknown, args: { id: number }) => {
      const user = db
        .prepare("SELECT * FROM User WHERE id = ?")
        .get(args.id) as User | undefined;
      if (!user) return null;

      // 関連する投稿も削除
      db.prepare("DELETE FROM Post WHERE authorId = ?").run(args.id);
      db.prepare("DELETE FROM User WHERE id = ?").run(args.id);

      return { ...user, posts: [] };
    },

    // 投稿作成
    createPost: (
      _: unknown,
      args: { title: string; content?: string; authorId: number }
    ) => {
      const now = new Date().toISOString();
      const result = db
        .prepare(
          "INSERT INTO Post (title, content, published, authorId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .run(args.title, args.content || null, 0, args.authorId, now, now);

      const post = db
        .prepare("SELECT * FROM Post WHERE id = ?")
        .get(result.lastInsertRowid) as Post;
      return { ...post, published: Boolean(post.published) };
    },

    // 投稿更新
    updatePost: (
      _: unknown,
      args: {
        id: number;
        title?: string;
        content?: string;
        published?: boolean;
      }
    ) => {
      const now = new Date().toISOString();
      const updates: string[] = ["updatedAt = ?"];
      const values: (string | number)[] = [now];

      if (args.title) {
        updates.push("title = ?");
        values.push(args.title);
      }
      if (args.content !== undefined) {
        updates.push("content = ?");
        values.push(args.content);
      }
      if (args.published !== undefined) {
        updates.push("published = ?");
        values.push(args.published ? 1 : 0);
      }
      values.push(args.id);

      db.prepare(`UPDATE Post SET ${updates.join(", ")} WHERE id = ?`).run(
        ...values
      );

      const post = db
        .prepare("SELECT * FROM Post WHERE id = ?")
        .get(args.id) as Post | undefined;
      if (!post) return null;
      return { ...post, published: Boolean(post.published) };
    },

    // 投稿削除
    deletePost: (_: unknown, args: { id: number }) => {
      const post = db
        .prepare("SELECT * FROM Post WHERE id = ?")
        .get(args.id) as Post | undefined;
      if (!post) return null;

      db.prepare("DELETE FROM Post WHERE id = ?").run(args.id);

      return { ...post, published: Boolean(post.published) };
    },
  },

  // フィールドリゾルバー（リレーション解決用）
  User: {
    posts: (parent: { id: number }) => {
      const posts = db
        .prepare("SELECT * FROM Post WHERE authorId = ?")
        .all(parent.id) as Post[];
      return posts.map((post) => ({
        ...post,
        published: Boolean(post.published),
      }));
    },
  },

  Post: {
    author: (parent: { authorId: number }) => {
      const user = db
        .prepare("SELECT * FROM User WHERE id = ?")
        .get(parent.authorId) as User | undefined;
      if (!user) return null;
      return { ...user, posts: [] };
    },
  },
};
