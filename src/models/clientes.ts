import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const tipoDocumentoEnum = pgEnum('tipo_documento', ['CPF', 'CNPJ']);

export const clientes = pgTable(
  'clientes',
  {
    id: serial('id').primaryKey(),
    nomeRazaoSocial: varchar('nome_razao_social', { length: 100 }).notNull(),
    tipoDocumento: tipoDocumentoEnum('tipo_documento').notNull(),
    documento: varchar('documento', { length: 14 }).notNull().unique(),
    telefonePrincipal: varchar('telefone_principal', { length: 15 }).notNull(),
    email: varchar('email', { length: 100 }),
    endereco: text('endereco'),
    isAtivo: boolean('is_ativo').default(true).notNull(),
    dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  },
  table => ({
    documentoUnicoIdx: uniqueIndex('idx_clientes_documento_unico').on(table.documento),
  })
);

export type Cliente = InferSelectModel<typeof clientes>;
export type NovoCliente = InferInsertModel<typeof clientes>;
