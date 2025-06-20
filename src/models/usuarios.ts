import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role_enum', ['ADMIN', 'CONSULTOR', 'TECNICO']);

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull().default('CONSULTOR'),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
});

export type Usuario = InferSelectModel<typeof usuarios>;
export type NovoUsuario = InferInsertModel<typeof usuarios>;
