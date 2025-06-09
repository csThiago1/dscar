# DSCar - Sistema de Gerenciamento de Oficina

## 📱 Sobre o Projeto
DSCar é um aplicativo móvel desenvolvido em React Native com Expo para gerenciamento de oficinas mecânicas. O sistema permite o controle completo de ordens de serviço, clientes, veículos e peças.

## 🚀 Tecnologias Utilizadas
- React Native
- Expo Router
- TypeScript
- Drizzle ORM
- Neon DB (PostgreSQL)
- Zustand (Gerenciamento de Estado)
- React Native Paper (UI Components)
- Jest (Testes)
- ESLint + Prettier (Padronização de Código)

## 📋 Estrutura do Projeto
```
dscar/
├── app/                    # Rotas e Telas (Expo Router)
│   ├── _layout.tsx        # Layout Principal
│   ├── index.tsx          # Redirecionamento
│   ├── login.tsx          # Tela de Login
│   ├── menu.tsx           # Menu Principal
│   └── os/                # Rotas de Ordens de Serviço
│       ├── index.tsx      # Lista de OS
│       ├── nova.tsx       # Nova OS
│       ├── [id].tsx       # Detalhes da OS
│       └── checklist/     # Checklist
│           └── [id].tsx   # Checklist específico
│
└── src/                   # Código Fonte
    ├── api/               # Configuração de API
    ├── components/        # Componentes Reutilizáveis
    ├── config/           # Configurações
    ├── db/               # Configuração do Banco
    │   ├── index.ts      # Conexão
    │   └── schema.ts     # Esquema
    ├── models/           # Modelos de Dados
    ├── screens/          # Telas (Componentes)
    ├── services/         # Serviços
    ├── stores/           # Estado Global (Zustand)
    └── utils/            # Utilitários
```

## 🔄 Workflow da Aplicação

### 1. Autenticação
- **Splash Screen**: Tela inicial com logo
- **Login**: Autenticação de usuários
  - Validação de campos
  - Persistência de sessão
  - Redirecionamento para Menu

### 2. Menu Principal
- **Dashboard**: Visão geral
  - OS em andamento
  - Próximos agendamentos
  - Alertas importantes
- **Navegação**:
  - Ordens de Serviço
  - Clientes
  - Veículos
  - Peças
  - Financeiro
  - Relatórios

### 3. Ordens de Serviço (OS)
- **Listagem**:
  - Filtros por status
  - Busca por cliente/veículo
  - Ordenação por data
- **Nova OS**:
  - Seleção de cliente
  - Seleção de veículo
  - Descrição do serviço
  - Valores (peças/serviços)
- **Detalhes da OS**:
  - Informações completas
  - Histórico de alterações
  - Checklist de serviços
  - Acompanhamento de status

### 4. Clientes
- **Cadastro**:
  - Dados pessoais
  - Contatos
  - Endereço
- **Listagem**:
  - Busca
  - Filtros
  - Histórico de serviços

### 5. Veículos
- **Cadastro**:
  - Dados do veículo
  - Histórico de serviços
  - Documentação
- **Listagem**:
  - Busca por placa/modelo
  - Filtros por cliente
  - Status de manutenção

### 6. Peças
- **Cadastro**:
  - Dados da peça
  - Estoque
  - Preços
- **Listagem**:
  - Controle de estoque
  - Histórico de uso
  - Alertas de estoque baixo

### 7. Financeiro
- **Controle**:
  - Faturamento
  - Despesas
  - Relatórios
- **Relatórios**:
  - Faturamento mensal
  - Serviços mais comuns
  - Análise de custos

## 💾 Modelos de Dados

### Cliente
```typescript
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCadastro: Date;
  dataAtualizacao: Date;
}
```

### Veículo
```typescript
interface Veiculo {
  id: string;
  clienteId: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  quilometragem: number;
  dataCadastro: Date;
  dataAtualizacao: Date;
}
```

### Ordem de Serviço
```typescript
interface OrdemServico {
  id: string;
  clienteId: string;
  veiculoId: string;
  dataEntrada: Date;
  dataPrevistaEntrega: Date;
  dataEntrega?: Date;
  quilometragem: number;
  descricaoServico: string;
  observacoes?: string;
  valorPecas: number;
  valorServicos: number;
  valorTotal: number;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  dataCadastro: Date;
  dataAtualizacao: Date;
}
```

## 🔐 Autenticação e Autorização
- JWT para autenticação
- Níveis de acesso:
  - Administrador
  - Mecânico
  - Atendente
- Persistência de sessão com AsyncStorage

## 📊 Banco de Dados
- PostgreSQL (Neon DB)
- Drizzle ORM para queries
- Migrations para controle de versão
- Relacionamentos:
  - Cliente -> Veículos
  - Veículo -> Ordens de Serviço
  - Ordem de Serviço -> Peças

## 🎨 UI/UX
- Tema consistente
- Componentes reutilizáveis
- Feedback visual para ações
- Validações em tempo real
- Loading states
- Tratamento de erros
- Responsividade

## 🧪 Testes
- Testes unitários com Jest
- Testes de componentes
- Testes de integração
- Cobertura mínima de 80%

## 📦 Scripts Disponíveis
```bash
# Desenvolvimento
npm start              # Inicia o Expo
npm run android        # Roda no Android
npm run ios           # Roda no iOS

# Qualidade
npm run lint          # Roda o ESLint
npm run lint:fix      # Corrige problemas de lint
npm run type-check    # Verifica tipos TypeScript

# Banco de Dados
npm run db:generate   # Gera migrations
npm run db:push      # Aplica migrations
npm run db:studio    # Abre o Drizzle Studio

# Testes
npm test             # Roda os testes
```

## 🔄 Fluxo de Desenvolvimento
1. Criar branch para feature
2. Desenvolver com TDD
3. Rodar lint e type-check
4. Criar PR com descrição detalhada
5. Code review
6. Merge após aprovação

## 📱 Requisitos do Sistema
- Node.js 18+
- Expo CLI
- PostgreSQL
- Android Studio / Xcode (para emuladores)

## 🔧 Configuração do Ambiente
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Configure o banco de dados
5. Execute as migrations:
   ```bash
   npm run db:push
   ```
6. Inicie o projeto:
   ```bash
   npm start
   ```

## 📈 Próximos Passos
- [ ] Implementar sistema de notificações
- [ ] Adicionar relatórios avançados
- [ ] Integração com sistemas de pagamento
- [ ] App para clientes
- [ ] Sistema de agendamento online

## 🤝 Contribuição
1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
