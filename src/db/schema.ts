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
  varchar,
} from 'drizzle-orm/pg-core';

// --- ENUMs ---
export const userRoleEnum = pgEnum('user_role_enum', ['ADMIN', 'CONSULTOR', 'TECNICO']);

export const tipoDocumentoEnum = pgEnum('tipo_documento', ['CPF', 'CNPJ']);
export const plataformaVeiculoEnum = pgEnum('plataforma_veiculo_enum', [
  'HATCH',
  'SEDAN',
  'SUV',
  'PICKUP',
  'VAN',
  'MOTO',
  'UTILITARIO_LEVE',
  'CAMINHAO_LEVE',
  'OUTRO',
]);
export const combustivelVeiculoEnum = pgEnum('combustivel_veiculo_enum', [
  'GASOLINA',
  'ETANOL',
  'DIESEL',
  'GNV',
  'ELETRICO',
  'FLEX',
  'HIBRIDO',
  'OUTRO',
]);
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
export const statusChecklistItemEnum = pgEnum('status_checklist_item_enum', [
  'OK',
  'AVARIADO',
  'AUSENTE',
  'NAO_APLICA',
]);
export const tipoEnvolvimentoSeguroEnum = pgEnum('tipo_envolvimento_seguro_enum', [
  'SEGURADO',
  'TERCEIRO',
]);
export const localizacaoVeiculoOSEnum = pgEnum('localizacao_veiculo_os_enum', [
  'OFICINA',
  'PATIO_INTERNO',
  'PATIO_EXTERNO',
  'CLIENTE',
  'TERCEIRO',
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

// --- Tabelas Principais ---
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  table => ({
    emailUniqueIdx: uniqueIndex('idx_users_email_unique').on(table.email),
  })
);

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
    anoFabricacao: integer('ano_fabricacao').notNull(),
    anoModelo: integer('ano_modelo').notNull(),
    cor: varchar('cor', { length: 50 }),
    quilometragemAtual: integer('quilometragem_atual'),
    dataUltimaAtualizacaoKm: timestamp('data_ultima_atualizacao_km'),
    chassi: varchar('chassi', { length: 17 }),
    motor: varchar('motor', { length: 30 }),
    observacoes: text('observacoes'),
    isAtivo: boolean('is_ativo').default(true).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  },
  table => ({
    placaUnicaIdx: uniqueIndex('idx_veiculos_placa_unica').on(table.placa),
    chassiUnicoIdx: uniqueIndex('idx_veiculos_chassi_unico').on(table.chassi),
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
    estoqueMaximo: integer('estoque_maximo'),
    localizacao: varchar('localizacao', { length: 50 }),
    observacoes: text('observacoes'),
    dataUltimaMovimentacao: timestamp('data_ultima_movimentacao'),
    isAtivo: boolean('is_ativo').default(true).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  },
  table => ({
    codigoUnicoIdx: uniqueIndex('idx_pecas_codigo_unico').on(table.codigo),
  })
);

export const ordensServico = pgTable(
  'ordens_servico',
  {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id')
      .references(() => clientes.id)
      .notNull(),
    veiculoId: integer('veiculo_id')
      .references(() => veiculos.id)
      .notNull(),
    dataEntrada: timestamp('data_entrada').defaultNow().notNull(),
    dataPrevistaEntrega: timestamp('data_prevista_entrega'),
    dataEntrega: timestamp('data_entrega'),
    quilometragem: integer('quilometragem').notNull(),
    descricaoServico: text('descricao_servico').notNull(),
    observacoes: text('observacoes'),
    valorPecas: decimal('valor_pecas', { precision: 10, scale: 2 }),
    valorServicos: decimal('valor_servicos', { precision: 10, scale: 2 }),
    valorTotal: decimal('valor_total', { precision: 10, scale: 2 }),
    status: statusOrdemServicoEnum('status').notNull().default('ORCAMENTO'),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
    dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  },
  table => ({
    clienteVeiculoUnicoIdx: uniqueIndex('idx_ordens_servico_cliente_veiculo_unico').on(
      table.clienteId,
      table.veiculoId
    ),
  })
);

export const pecasUtilizadas = pgTable(
  'pecas_utilizadas',
  {
    id: serial('id').primaryKey(),
    ordemServicoId: integer('ordem_servico_id')
      .references(() => ordensServico.id)
      .notNull(),
    pecaId: integer('peca_id')
      .references(() => pecas.id)
      .notNull(),
    quantidade: integer('quantidade').notNull(),
    valorUnitario: decimal('valor_unitario', {
      precision: 10,
      scale: 2,
    }).notNull(),
    valorTotal: decimal('valor_total', { precision: 10, scale: 2 }).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  },
  table => ({
    ordemServicoPecaUnicoIdx: uniqueIndex('idx_pecas_utilizadas_ordem_servico_peca_unico').on(
      table.ordemServicoId,
      table.pecaId
    ),
  })
);

export const checklistItems = pgTable('checklist_items', {
  id: serial('id').primaryKey(),
  ordemServicoId: integer('ordem_servico_id')
    .references(() => ordensServico.id)
    .notNull(),
  nome: text('nome').notNull(),
  status: text('status').notNull().default('pendente'),
  observacao: text('observacao'),
  foto: text('foto'),
  dataCriacao: timestamp('data_criacao').notNull().defaultNow(),
  dataAtualizacao: timestamp('data_atualizacao').notNull().defaultNow(),
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
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tipos gerados pelo Drizzle
export type OrdemServico = typeof ordensServico.$inferSelect;
export type NovaOrdemServico = typeof ordensServico.$inferInsert;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type NovoChecklistItem = typeof checklistItems.$inferInsert;

// Tipos inferidos
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Cliente = InferSelectModel<typeof clientes>;
export type NovoCliente = InferInsertModel<typeof clientes>;

export type Veiculo = InferSelectModel<typeof veiculos>;
export type NovoVeiculo = InferInsertModel<typeof veiculos>;

export type Peca = InferSelectModel<typeof pecas>;
export type NovaPeca = InferInsertModel<typeof pecas>;

export type Agendamento = typeof agendamentos.$inferSelect;
export type NewAgendamento = typeof agendamentos.$inferInsert;

export type PecaUtilizada = typeof pecasUtilizadas.$inferSelect;
export type NovaPecaUtilizada = typeof pecasUtilizadas.$inferInsert;

// Relacionamentos
export const clientesRelations = relations(clientes, ({ many }) => ({
  veiculos: many(veiculos),
  ordensServico: many(ordensServico),
}));

export const veiculosRelations = relations(veiculos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [veiculos.clienteId],
    references: [clientes.id],
  }),
  ordensServico: many(ordensServico),
}));

export const ordensServicoRelations = relations(ordensServico, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [ordensServico.clienteId],
    references: [clientes.id],
  }),
  veiculo: one(veiculos, {
    fields: [ordensServico.veiculoId],
    references: [veiculos.id],
  }),
  pecasUtilizadas: many(pecasUtilizadas),
}));

export const pecasRelations = relations(pecas, ({ many }) => ({
  pecasUtilizadas: many(pecasUtilizadas),
}));

export const pecasUtilizadasRelations = relations(pecasUtilizadas, ({ one }) => ({
  ordemServico: one(ordensServico, {
    fields: [pecasUtilizadas.ordemServicoId],
    references: [ordensServico.id],
  }),
  peca: one(pecas, {
    fields: [pecasUtilizadas.pecaId],
    references: [pecas.id],
  }),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  ordemServico: one(ordensServico, {
    fields: [checklistItems.ordemServicoId],
    references: [ordensServico.id],
  }),
}));
