import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as clientesSchema from "../models/clientes";
import * as ordensServicoSchema from "../models/ordensServico";
import * as pecasSchema from "../models/pecas";
import * as servicosSchema from "../models/servicos";
import * as usuariosSchema from "../models/usuarios";
import * as veiculosSchema from "../models/veiculos";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não está definida nas variáveis de ambiente. Crie um arquivo .env no diretório raiz do projeto e adicione a variável."
  );
}

const sql = neon(process.env.DATABASE_URL!);

const schema = {
  ...clientesSchema,
  ...ordensServicoSchema,
  ...pecasSchema,
  ...servicosSchema,
  ...usuariosSchema,
  ...veiculosSchema,
};

// Adicionado "as any" para contornar um problema de tipagem do Drizzle/Neon no ambiente atual.
export const db = drizzle(sql as any, { schema });

// Função para testar a conexão
export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    return false;
  }
}
