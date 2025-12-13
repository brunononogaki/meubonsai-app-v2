import { Client } from "pg";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (err) {
    console.log("\n Erro dentro do catch do database.js:");
    console.error(err);
    throw err;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });
  await client.connect();
  return client;
}

const database = {
  // query: query,
  // getNewClient: getNewClient,
  query,
  getNewClient,
};

export default database;
