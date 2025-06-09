import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ordensServico } from "./ordensServico";

export const servicos = pgTable("servicos", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 30 }).notNull().unique(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  valorPadrao: decimal("valor_padrao", { precision: 10, scale: 2 }).notNull(),
  tempoMedioMinutos: integer("tempo_medio_minutos"),
  categoria: varchar("categoria", { length: 50 }),
  isAtivo: boolean("is_ativo").notNull().default(true),
  dataCadastro: timestamp("data_cadastro").notNull().defaultNow(),
  dataAtualizacao: timestamp("data_atualizacao").notNull().defaultNow(),
});

export const servicosRealizados = pgTable("servicos_realizados", {
  id: serial("id").primaryKey(),
  ordemServicoId: uuid("ordem_servico_id")
    .notNull()
    .references(() => ordensServico.id, { onDelete: "cascade" }),
  servicoId: integer("servico_id")
    .notNull()
    .references(() => servicos.id),
  quantidade: integer("quantidade").notNull().default(1),
  valorUnitario: decimal("valor_unitario", {
    precision: 10,
    scale: 2,
  }).notNull(),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  observacao: text("observacao"),
  dataCadastro: timestamp("data_cadastro").notNull().defaultNow(),
});
