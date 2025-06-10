/* eslint-disable no-console */
const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config({ path: '.env' });

async function testConnection() {
  console.log('🔄 Testando conexão com Neon DB...\n');

  // Verificar se a variável de ambiente existe
  const databaseUrl = process.env.EXPO_PUBLIC_DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ ERRO: EXPO_PUBLIC_DATABASE_URL não está definida!');
    console.log('\n💡 SOLUÇÃO:');
    console.log('1. Crie um arquivo .env na raiz do projeto');
    console.log('2. Adicione: EXPO_PUBLIC_DATABASE_URL="sua-string-de-conexao-neon"');
    console.log(
      '3. Exemplo: EXPO_PUBLIC_DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"'
    );
    process.exit(1);
  }

  console.log('✅ Variável de ambiente encontrada');

  try {
    const sql = neon(databaseUrl);

    // Teste básico de conexão
    console.log('🔄 Executando teste de conexão...');
    const result = await sql`SELECT 1 as test, NOW() as timestamp`;

    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('📊 Resultado do teste:', result[0]);

    // Teste de consulta nas tabelas
    console.log('\n🔄 Testando consultas nas tabelas...');

    try {
      const clientes = await sql`SELECT COUNT(*) FROM clientes`;
      console.log(`👥 Clientes: ${clientes[0].count} registros`);
    } catch (error) {
      console.log('⚠️  Tabela clientes não existe ou está vazia');
    }

    try {
      const veiculos = await sql`SELECT COUNT(*) FROM veiculos`;
      console.log(`🚗 Veículos: ${veiculos[0].count} registros`);
    } catch (error) {
      console.log('⚠️  Tabela veiculos não existe ou está vazia');
    }

    try {
      const ordensServico = await sql`SELECT COUNT(*) FROM ordens_servico`;
      console.log(`🔧 Ordens de Serviço: ${ordensServico[0].count} registros`);
    } catch (error) {
      console.log('⚠️  Tabela ordens_servico não existe ou está vazia');
    }

    try {
      const agendamentos = await sql`SELECT COUNT(*) FROM agendamentos`;
      console.log(`📅 Agendamentos: ${agendamentos[0].count} registros`);
    } catch (error) {
      console.log('⚠️  Tabela agendamentos não existe ou está vazia');
    }

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. Execute "npm run db:generate" para gerar migrações');
    console.log('2. Execute "npm run db:push" para aplicar o schema');
    console.log('3. Inicie a aplicação com "npm start"');
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:');
    console.error(error.message);

    console.log('\n🔧 POSSÍVEIS SOLUÇÕES:');
    console.log('1. Verifique se a URL do banco está correta');
    console.log('2. Verifique se o banco de dados existe no Neon');
    console.log('3. Verifique suas credenciais de acesso');
    console.log('4. Verifique sua conexão com a internet');

    process.exit(1);
  }
}

// Executar teste
testConnection();
