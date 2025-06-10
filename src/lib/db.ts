import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Fallback para desenvolvimento - aceita as duas variáveis
const databaseUrl =
  process.env.EXPO_PUBLIC_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://user:pass@host.neon.tech/db?sslmode=require';

// Para desenvolvimento/teste, use uma URL válida
const isTestMode = databaseUrl.includes('user:pass@host.neon.tech');

if (isTestMode) {
  console.warn('⚠️  Usando URL de teste! Configure EXPO_PUBLIC_DATABASE_URL no arquivo .env');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

// Função para testar a conexão
export async function testConnection() {
  try {
    if (isTestMode) {
      console.log('🧪 Modo de teste ativo - pulando teste de conexão real');
      return false;
    }

    const result = await sql`SELECT 1 as test`;
    console.log('✅ Conexão com Neon DB estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    return false;
  }
}
