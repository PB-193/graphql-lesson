import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

// Apollo Server インスタンスを作成
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// サーバーを起動
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`
  🚀 GraphQL サーバーが起動しました！

  URL: ${url}

  GraphQL Playground でクエリをテストできます。
  ブラウザで ${url} にアクセスしてください。
  `);
};

startServer();
