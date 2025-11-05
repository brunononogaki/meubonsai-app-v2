import database from "infra/database.js";

async function get_postgres_version() {
  const result = await database.query("SHOW server_version");
  return result.rows[0].server_version;
}

async function get_postgres_max_connections() {
  const result = await database.query(
    "SHOW max_connections",
  );
  return parseInt(result.rows[0].max_connections);
}

async function get_postgres_used_connections() {
  // Sem proteção de SQL Injection:
  // `SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = '${process.env.POSTGRES_DB}';`
  const result = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB]
  });
  return result.rows[0].count;
}

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database : {
        version: await get_postgres_version(),
        max_connections: await get_postgres_max_connections(),
        opened_connections: await get_postgres_used_connections(),
      }
    }
  });
}
