import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "src/env";

const connection = postgres(env.DATABASE_URL, { max: 1 });
export const db = drizzle(connection);

async function runMigration() {
  try {
    console.log("Iniciando a migração...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migração concluída com sucesso.");
  } catch (error) {
    console.error("Erro durante a migração:", error);
  } finally {
    await connection.end();
    console.log("Conexão com o banco de dados encerrada.");
  }
}

runMigration();
