import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  date,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// --- ENUMs ---
export const userRoleEnum = pgEnum('user_role_enum', ['ADMIN', 'CONSULTOR', 'TECNICO']);

export const tipoDocumentoEnum = pgEnum('tipo_documento', ['CPF', 'CNPJ']);

export const statusOrdemServicoEnum = pgEnum('status_ordem_servico', [
  'ORCAMENTO',
  'APROVADA_CLIENTE',
  'EM_SERVICO',
  'SERVICO_CONCLUIDO',
  'ENTREGUE',
  'CANCELADA',
]);

export const tipoOSEnum = pgEnum('tipo_os_enum', [
  'PARTICULAR',
  'SEGURADORA',
  'GARANTIA_INTERNA',
  'CORTESIA',
]);

export const unidadeMedidaEnum = pgEnum('unidade_medida', [
  'UN',
  'PC',
  'CX',
  'KG',
  'L',
  'M',
  'M2',
  'M3',
]);

// --- Tabelas ---
export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull().default('CONSULTOR'),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
});

export const clientes = pgTable(
  'clientes',
  {
    id: serial('id').primaryKey(),
    nomeRazaoSocial: varchar('nome_razao_social', { length: 100 }).notNull(),
    tipoDocumento: tipoDocumentoEnum('tipo_documento').notNull(),
    documento: varchar('documento', { length: 14 }).notNull().unique(),
    telefonePrincipal: varchar('telefone_principal', { length: 15 }).notNull(),
    telefoneSecundario: varchar('telefone_secundario', { length: 15 }),
    email: varchar('email', { length: 100 }),
    endereco: text('endereco'),
    observacoes: text('observacoes'),
    isAtivo: boolean('is_ativo').default(true).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  },
  table => ({
    documentoUnicoIdx: uniqueIndex('idx_clientes_documento_unico').on(table.documento),
  })
);

export const veiculos = pgTable(
  'veiculos',
  {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id')
      .references(() => clientes.id)
      .notNull(),
    placa: varchar('placa', { length: 10 }).notNull().unique(),
    marca: varchar('marca', { length: 50 }).notNull(),
    modelo: varchar('modelo', { length: 50 }).notNull(),
    versao: varchar('versao', { length: 50 }),
    ano: integer('ano').notNull(),
    cor: varchar('cor', { length: 50 }),
    quilometragemAtual: integer('quilometragem_atual'),
    chassi: varchar('chassi', { length: 17 }),
    motor: varchar('motor', { length: 30 }),
    observacoes: text('observacoes'),
    isAtivo: boolean('is_ativo').default(true).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  },
  table => ({
    placaUnicaIdx: uniqueIndex('idx_veiculos_placa_unica').on(table.placa),
  })
);

export const pecas = pgTable(
  'pecas',
  {
    id: serial('id').primaryKey(),
    codigo: varchar('codigo', { length: 50 }).notNull().unique(),
    nome: varchar('nome', { length: 100 }).notNull(),
    descricao: text('descricao'),
    unidadeMedida: unidadeMedidaEnum('unidade_medida').notNull(),
    quantidadeEstoque: integer('quantidade_estoque').default(0).notNull(),
    precoCompra: decimal('preco_compra', { precision: 10, scale: 2 }).notNull(),
    precoVenda: decimal('preco_venda', { precision: 10, scale: 2 }).notNull(),
    estoqueMinimo: integer('estoque_minimo').default(0).notNull(),
    localizacao: varchar('localizacao', { length: 50 }),
    observacoes: text('observacoes'),
    isAtivo: boolean('is_ativo').default(true).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  },
  table => ({
    codigoUnicoIdx: uniqueIndex('idx_pecas_codigo_unico').on(table.codigo),
  })
);

export const servicos = pgTable('servicos', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 100 }).notNull(),
  descricao: text('descricao'),
  precoBase: decimal('preco_base', { precision: 10, scale: 2 }).notNull(),
  tempoEstimado: integer('tempo_estimado'), // em minutos
  categoria: varchar('categoria', { length: 50 }),
  isAtivo: boolean('is_ativo').default(true).notNull(),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
});

export const ordensServico = pgTable('ordens_servico', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id')
    .references(() => clientes.id)
    .notNull(),
  veiculoId: integer('veiculo_id')
    .references(() => veiculos.id)
    .notNull(),
  tecnicoId: uuid('tecnico_id').references(() => usuarios.id),
  dataEntrada: timestamp('data_entrada').defaultNow().notNull(),
  dataPrevistaEntrega: timestamp('data_prevista_entrega'),
  dataEntrega: timestamp('data_entrega'),
  quilometragem: integer('quilometragem').notNull(),
  tipo: tipoOSEnum('tipo').notNull().default('PARTICULAR'),
  descricaoServico: text('descricao_servico').notNull(),
  observacoes: text('observacoes'),
  valorPecas: decimal('valor_pecas', { precision: 10, scale: 2 }).default('0'),
  valorServicos: decimal('valor_servicos', { precision: 10, scale: 2 }).default('0'),
  valorTotal: decimal('valor_total', { precision: 10, scale: 2 }).default('0'),
  status: statusOrdemServicoEnum('status').notNull().default('ORCAMENTO'),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
});

export const agendamentos = pgTable('agendamentos', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id')
    .references(() => clientes.id)
    .notNull(),
  data: date('data').notNull(),
  hora: varchar('hora', { length: 5 }).notNull(),
  servico: varchar('servico', { length: 255 }).notNull(),
  observacoes: text('observacoes'),
  status: varchar('status', { length: 20 }).notNull().default('pendente'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// --- Relacionamentos ---
export const clientesRelations = relations(clientes, ({ many }) => ({
  veiculos: many(veiculos),
  ordensServico: many(ordensServico),
  agendamentos: many(agendamentos),
}));

export const veiculosRelations = relations(veiculos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [veiculos.clienteId],
    references: [clientes.id],
  }),
  ordensServico: many(ordensServico),
}));

export const ordensServicoRelations = relations(ordensServico, ({ one }) => ({
  cliente: one(clientes, {
    fields: [ordensServico.clienteId],
    references: [clientes.id],
  }),
  veiculo: one(veiculos, {
    fields: [ordensServico.veiculoId],
    references: [veiculos.id],
  }),
  tecnico: one(usuarios, {
    fields: [ordensServico.tecnicoId],
    references: [usuarios.id],
  }),
}));

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  ordensServicoComoTecnico: many(ordensServico),
}));

export const agendamentosRelations = relations(agendamentos, ({ one }) => ({
  cliente: one(clientes, {
    fields: [agendamentos.clienteId],
    references: [clientes.id],
  }),
}));

// --- Tipos ---
export type Usuario = InferSelectModel<typeof usuarios>;
export type NovoUsuario = InferInsertModel<typeof usuarios>;

export type Cliente = InferSelectModel<typeof clientes>;
export type NovoCliente = InferInsertModel<typeof clientes>;

export type Veiculo = InferSelectModel<typeof veiculos>;
export type NovoVeiculo = InferInsertModel<typeof veiculos>;

export type Peca = InferSelectModel<typeof pecas>;
export type NovaPeca = InferInsertModel<typeof pecas>;

export type Servico = InferSelectModel<typeof servicos>;
export type NovoServico = InferInsertModel<typeof servicos>;

export type OrdemServico = InferSelectModel<typeof ordensServico>;
export type NovaOrdemServico = InferInsertModel<typeof ordensServico>;

export type Agendamento = InferSelectModel<typeof agendamentos>;
export type NovoAgendamento = InferInsertModel<typeof agendamentos>;
