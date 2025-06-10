# DSCar - Sistema de Gestão de Oficinas

![React Native](https://img.shields.io/badge/React%20Native-0.73-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-~50.0-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue?logo=typescript)
![Drizzle](https://img.shields.io/badge/Drizzle-0.31-green)
![Neon](https://img.shields.io/badge/Neon-DB-purple)

Sistema completo de gestão para oficinas mecânicas, desenvolvido com React Native, Expo Router e Drizzle ORM.

## 🎯 Funcionalidades

### ✅ Implementadas

- **🔐 Sistema de Autenticação** - Login seguro com persistência
- **👥 Gestão de Clientes** - Cadastro, listagem e busca de clientes
- **🚗 Gestão de Veículos** - Controle de veículos por cliente
- **🔧 Ordens de Serviço** - Criação e acompanhamento de OS
- **📅 Agendamentos** - Sistema de agendamento de serviços
- **📱 Interface Moderna** - UI responsiva e intuitiva
- **🗄️ Banco de Dados** - PostgreSQL na nuvem com Neon DB

### 🚧 Em Desenvolvimento

- Gestão de Estoque
- Relatórios Financeiros
- Sistema de Notificações
- Backup Automático

## 🛠️ Stack Tecnológico

- **📱 Frontend**: React Native 0.73 + Expo Router v3
- **🎨 UI/UX**: StyleSheet nativo + Ionicons
- **🗄️ Banco de Dados**: PostgreSQL (Neon DB)
- **🔄 ORM**: Drizzle ORM v0.31
- **🔐 Autenticação**: Context API + Expo Secure Store
- **📱 Navegação**: Expo Router com navigação por tabs
- **🔧 Ferramentas**: TypeScript, ESLint, Prettier

## 🚀 Configuração Rápida

### 1. Pré-requisitos

```bash
# Node.js 18+
node --version

# Expo CLI
npm install -g @expo/cli

# Clone o projeto
git clone <seu-repositorio>
cd dscar
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Banco de Dados

1. **Crie uma conta no [Neon DB](https://neon.tech)**
2. **Crie um novo projeto/banco de dados**
3. **Copie a connection string**
4. **Crie um arquivo `.env` na raiz:**

```env
EXPO_PUBLIC_DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"
```

### 4. Aplicar Schema do Banco

```bash
# Gerar migrações
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Testar conexão
npm run test-db
```

### 5. Iniciar a Aplicação

```bash
# Desenvolvimento
npm start

# iOS (macOS only)
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔐 Credenciais de Teste

**Email**: `admin@dscar.com`  
**Senha**: `admin`

## 📁 Estrutura do Projeto

```
dscar/
├── app/                          # Rotas da aplicação (Expo Router)
│   ├── (app)/                   # Grupo autenticado
│   │   ├── ordens-servico/      # Telas de OS
│   │   ├── clientes/            # Telas de clientes
│   │   ├── veiculos/            # Telas de veículos
│   │   └── agendamentos/        # Telas de agendamentos
│   ├── (auth)/                  # Grupo de autenticação
│   │   └── login.tsx            # Tela de login
│   ├── _layout.tsx              # Layout principal
│   └── index.tsx                # Tela inicial
├── src/                         # Código fonte
│   ├── contexts/                # Contexts (Auth, etc)
│   ├── lib/                     # Configurações
│   │   ├── db.ts               # Conexão com banco
│   │   └── schema.ts           # Schema Drizzle
│   └── components/              # Componentes reutilizáveis
├── drizzle/                     # Migrações do banco
├── scripts/                     # Scripts utilitários
└── assets/                      # Imagens, fontes, etc
```

## 🗄️ Schema do Banco

### Principais Tabelas

- **👥 clientes** - Dados dos clientes (CPF/CNPJ)
- **🚗 veiculos** - Veículos vinculados aos clientes
- **🔧 ordens_servico** - Ordens de serviço e manutenções
- **📅 agendamentos** - Agendamentos de serviços
- **👤 usuarios** - Usuários do sistema (admin/técnico/consultor)
- **🛠️ servicos** - Catálogo de serviços
- **📦 pecas** - Controle de estoque de peças

## 📱 Scripts Disponíveis

```bash
# 🚀 Desenvolvimento
npm start                 # Iniciar com Expo
npm run android          # Executar no Android
npm run ios             # Executar no iOS
npm run web             # Executar na web

# 🗄️ Banco de Dados
npm run db:generate     # Gerar migrações
npm run db:push         # Aplicar schema
npm run db:studio       # Abrir Drizzle Studio
npm run test-db         # Testar conexão

# 🔧 Ferramentas
npm run lint            # Executar ESLint
npm run type-check      # Verificar tipos TypeScript
npm test               # Executar testes
```

## 🎨 Capturas de Tela

> 📸 Adicione capturas de tela da aplicação aqui

## 🤝 Contribuindo

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Add nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 **Email**: seu-email@exemplo.com
- 💬 **Discord**: [Link do servidor](https://discord.gg/seu-server)
- 📖 **Documentação**: [Link da documentação](https://docs.exemplo.com)

## 🙏 Agradecimentos

- [Expo Team](https://expo.dev) - Framework React Native
- [Drizzle Team](https://orm.drizzle.team) - ORM TypeScript
- [Neon](https://neon.tech) - PostgreSQL na nuvem
- [React Native Community](https://reactnative.dev) - Ecossistema incrível

---

<div align="center">

**Feito com ❤️ para a comunidade de oficinas mecânicas**

[⭐ Star no GitHub](https://github.com/seu-usuario/dscar) • [🐛 Reportar Bug](https://github.com/seu-usuario/dscar/issues) • [💡 Sugerir Feature](https://github.com/seu-usuario/dscar/issues)

</div>
