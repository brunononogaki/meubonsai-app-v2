import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  });
  
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (err) {
    console.log(err)
    throw error;
  } finally {
    await client.end();
  }

}

export default {
  query: query,
};
