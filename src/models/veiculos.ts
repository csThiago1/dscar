import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { clientes } from "./clientes";
import { ordensServico } from "./ordensServico";

export const veiculos = pgTable(
  "veiculos",
  {
    id: serial("id").primaryKey(),
    clienteId: integer("cliente_id")
      .references(() => clientes.id)
      .notNull(),
    placa: varchar("placa", { length: 8 }).notNull().unique(),
    marca: varchar("marca", { length: 50 }).notNull(),
    modelo: varchar("modelo", { length: 50 }).notNull(),
    anoFabricacao: integer("ano_fabricacao").notNull(),
    anoModelo: integer("ano_modelo").notNull(),
    chassi: varchar("chassi", { length: 17 }),
    cor: varchar("cor", { length: 30 }),
    isAtivo: boolean("is_ativo").default(true).notNull(),
    dataCadastro: timestamp("data_cadastro").defaultNow().notNull(),
  },
  (table) => ({
    placaUnicaIdx: uniqueIndex("idx_veiculos_placa_unica").on(table.placa),
  })
);

export const veiculosRelations = relations(veiculos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [veiculos.clienteId],
    references: [clientes.id],
  }),
  ordensServico: many(ordensServico),
}));

export type Veiculo = InferSelectModel<typeof veiculos>;
export type NovoVeiculo = InferInsertModel<typeof veiculos>;
