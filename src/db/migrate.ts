import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";

dotenv.config();

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const sql = fs.readFileSync(
      path.join(process.cwd(), "drizzle", "0000_users.sql"),
      "utf8"
    );

    await client.query(sql);
    console.log("Migração executada com sucesso!");
  } catch (error) {
    console.error("Erro ao executar migração:", error);
  } finally {
    await client.end();
  }
}

migrate();
