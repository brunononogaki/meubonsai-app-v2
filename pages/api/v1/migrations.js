import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    verbose: true,
    direction: "up",
    migrationsTable: "pgmigrations",
  };
  try {
    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      await dbClient.end();
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      await dbClient.end();
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      } else {
        return response.status(200).json(migratedMigrations);
      }
    }
  } catch (err) {
    console.log(err);
    throw error; 
  } finally {
    await dbClient.end();
  }
  
  return response.status(405).json({ error: "Method Not Allowed" });
}
