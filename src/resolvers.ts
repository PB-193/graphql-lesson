import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// リゾルバー定義
export const resolvers = {
  // Query リゾルバー
  Query: {
    // 全ユーザー取得
    users: () => {
      return prisma.user.findMany({
        include: { posts: true },
      });
    },

    // 特定のユーザー取得
    user: (_: unknown, args: { id: number }) => {
      return prisma.user.findUnique({
        where: { id: args.id },
        include: { posts: true },
      });
    },

    // 全投稿取得
    posts: () => {
      return prisma.post.findMany({
        include: { author: true },
      });
    },

    // 特定の投稿取得
    post: (_: unknown, args: { id: number }) => {
      return prisma.post.findUnique({
        where: { id: args.id },
        include: { author: true },
      });
    },
  },

  // Mutation リゾルバー
  Mutation: {
    // ユーザー作成
    createUser: (_: unknown, args: { email: string; name: string }) => {
      return prisma.user.create({
        data: {
          email: args.email,
          name: args.name,
        },
        include: { posts: true },
      });
    },

    // ユーザー更新
    updateUser: (
      _: unknown,
      args: { id: number; email?: string; name?: string }
    ) => {
      return prisma.user.update({
        where: { id: args.id },
        data: {
          ...(args.email && { email: args.email }),
          ...(args.name && { name: args.name }),
        },
        include: { posts: true },
      });
    },

    // ユーザー削除
    deleteUser: (_: unknown, args: { id: number }) => {
      return prisma.user.delete({
        where: { id: args.id },
        include: { posts: true },
      });
    },

    // 投稿作成
    createPost: (
      _: unknown,
      args: { title: string; content?: string; authorId: number }
    ) => {
      return prisma.post.create({
        data: {
          title: args.title,
          content: args.content,
          authorId: args.authorId,
        },
        include: { author: true },
      });
    },

    // 投稿更新
    updatePost: (
      _: unknown,
      args: { id: number; title?: string; content?: string; published?: boolean }
    ) => {
      return prisma.post.update({
        where: { id: args.id },
        data: {
          ...(args.title && { title: args.title }),
          ...(args.content !== undefined && { content: args.content }),
          ...(args.published !== undefined && { published: args.published }),
        },
        include: { author: true },
      });
    },

    // 投稿削除
    deletePost: (_: unknown, args: { id: number }) => {
      return prisma.post.delete({
        where: { id: args.id },
        include: { author: true },
      });
    },
  },

  // フィールドリゾルバー（リレーション解決用）
  User: {
    posts: (parent: { id: number }) => {
      return prisma.post.findMany({
        where: { authorId: parent.id },
      });
    },
  },

  Post: {
    author: (parent: { authorId: number }) => {
      return prisma.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};
