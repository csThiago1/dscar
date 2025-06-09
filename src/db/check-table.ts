import * as dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

async function checkTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users';
    `);

    console.log("Estrutura da tabela users:", result.rows);
  } catch (error) {
    console.error("Erro ao verificar tabela:", error);
  } finally {
    await client.end();
  }
}

checkTable();
