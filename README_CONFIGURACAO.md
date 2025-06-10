# 🚀 DSCar - Sistema de Gestão de Oficinas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta no Neon DB (https://neon.tech)
- Expo CLI instalado globalmente: `npm install -g @expo/cli`

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório e instale as dependências

```bash
git clone <seu-repositorio>
cd dscar
npm install
```

### 2. Configure o banco de dados Neon

1. Acesse https://neon.tech e crie uma conta
2. Crie um novo projeto
3. Copie a string de conexão do banco
4. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://seu-usuario:sua-senha@seu-host.neon.tech/seu-banco?sslmode=require"
```

**Exemplo:**

```env
DATABASE_URL="postgresql://dscar_user:minha_senha@ep-cool-snow-123456.us-east-1.aws.neon.tech/dscar_db?sslmode=require"
```

### 3. Execute as migrações do banco

```bash
# Gerar migrações
npx drizzle-kit generate:pg

# Aplicar migrações (usar push para desenvolvimento)
npx drizzle-kit push:pg
```

### 4. Inicie a aplicação

```bash
npm start
```

## 🏗️ Estrutura da Aplicação

```
app/
├── _layout.tsx          # Layout principal
├── index.tsx            # Tela inicial de redirecionamento
├── menu.tsx             # Menu principal
├── (auth)/              # Rotas de autenticação
│   └── login.tsx        # Tela de login
└── (app)/               # Rotas autenticadas (com tabs)
    ├── _layout.tsx      # Layout com tabs
    ├── ordens-servico/  # Gestão de ordens de serviço
    ├── clientes/        # Gestão de clientes
    ├── veiculos/        # Gestão de veículos
    └── agendamentos/    # Gestão de agendamentos

src/
├── contexts/            # Contextos React (autenticação)
├── lib/                 # Configurações (banco, schema)
├── components/          # Componentes reutilizáveis
└── utils/              # Funções utilitárias
```

## 🔐 Autenticação

**Credenciais padrão para teste:**

- Email: `admin@dscar.com`
- Senha: `admin`

## 🗄️ Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- **usuarios**: Gestão de usuários do sistema
- **clientes**: Cadastro de clientes
- **veiculos**: Cadastro de veículos
- **ordensServico**: Ordens de serviço
- **agendamentos**: Agendamentos de serviços
- **pecas**: Cadastro de peças
- **servicos**: Cadastro de serviços

## 📱 Funcionalidades

### ✅ Implementadas

- ✅ Autenticação com persistência local
- ✅ Navegação por tabs
- ✅ Listagem de ordens de serviço
- ✅ Listagem de clientes com busca
- ✅ Listagem de veículos com busca
- ✅ Listagem de agendamentos

### 🚧 Em Desenvolvimento

- 🚧 Criação/edição de ordens de serviço
- 🚧 Criação/edição de clientes
- 🚧 Criação/edição de veículos
- 🚧 Criação/edição de agendamentos
- 🚧 Gestão de peças
- 🚧 Gestão de serviços

## 🔧 Comandos Úteis

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no iOS
npm run ios

# Executar no Android
npm run android

# Limpar cache do Metro
npx expo start --clear

# Visualizar banco de dados
npx drizzle-kit studio

# Reset das migrações
rm -rf drizzle/
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

## 🐛 Resolução de Problemas

### Erro: "DATABASE_URL não está definida"

- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme se a variável `DATABASE_URL` está definida corretamente

### Erro de conexão com o banco

- Verifique se a string de conexão está correta
- Confirme se o banco Neon está ativo
- Teste a conexão diretamente no dashboard do Neon

### Problemas com cache

```bash
npx expo start --clear
```

### Problemas com tipos TypeScript

```bash
npx expo install --fix
```

## 📚 Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **Expo Router**: Navegação baseada em arquivos
- **Drizzle ORM**: ORM para TypeScript
- **Neon DB**: Banco PostgreSQL serverless
- **TypeScript**: Tipagem estática
- **Expo Secure Store**: Armazenamento seguro local

## 🎯 Próximos Passos

1. **Configure o arquivo .env** com sua string de conexão do Neon
2. **Execute as migrações** para criar as tabelas
3. **Inicie a aplicação** e faça login com as credenciais padrão
4. **Teste as funcionalidades** implementadas
5. **Explore o código** para entender a estrutura

## 💡 Dicas

- Use o Drizzle Studio para visualizar e editar dados: `npx drizzle-kit studio`
- O arquivo de schema está em `src/lib/schema.ts`
- A configuração do banco está em `src/lib/db.ts`
- Para adicionar novas tabelas, edite o schema e execute as migrações

## 🚀 Deploy

Para fazer deploy da aplicação:

1. Configure as variáveis de ambiente no serviço de hosting
2. Execute o build: `npm run build`
3. Deploy conforme a plataforma escolhida (Vercel, Netlify, etc.)

## 📞 Suporte

Em caso de dúvidas ou problemas, verifique:

1. Este arquivo README
2. Os logs do console
3. A documentação do Expo Router
4. A documentação do Drizzle ORM
