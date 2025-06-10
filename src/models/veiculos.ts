import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const veiculos = pgTable('veiculos', {
  id: serial('id').primaryKey(),
  clienteId: integer('cliente_id').notNull(),
  marca: varchar('marca', { length: 50 }).notNull(),
  modelo: varchar('modelo', { length: 50 }).notNull(),
  ano: integer('ano').notNull(),
  placa: varchar('placa', { length: 10 }).notNull().unique(),
  chassi: varchar('chassi', { length: 17 }),
  quilometragemAtual: integer('quilometragem_atual'),
  observacoes: varchar('observacoes', { length: 500 }),
  isAtivo: boolean('is_ativo').default(true).notNull(),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
});

export type Veiculo = InferSelectModel<typeof veiculos>;
export type NovoVeiculo = InferInsertModel<typeof veiculos>;
