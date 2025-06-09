import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { ordensServico } from "./ordensServico";

export const unidadeMedidaEnum = pgEnum("unidade_medida", [
  "UN",
  "PC",
  "CX",
  "KG",
  "L",
  "M",
  "M2",
  "M3",
]);

export const pecas = pgTable("pecas", {
  id: serial("id").primaryKey(),
  codigo: varchar("codigo", { length: 30 }).notNull().unique(),
  nome: varchar("nome", { length: 100 }).notNull(),
  descricao: text("descricao"),
  unidadeMedida: unidadeMedidaEnum("unidade_medida").notNull(),
  quantidadeEstoque: integer("quantidade_estoque").notNull().default(0),
  precoCompra: decimal("preco_compra", { precision: 10, scale: 2 }).notNull(),
  precoVenda: decimal("preco_venda", { precision: 10, scale: 2 }).notNull(),
  estoqueMinimo: integer("estoque_minimo").notNull().default(0),
  estoqueMaximo: integer("estoque_maximo"),
  localizacao: varchar("localizacao", { length: 50 }),
  observacoes: text("observacoes"),
  dataUltimaMovimentacao: timestamp("data_ultima_movimentacao"),
  isAtivo: boolean("is_ativo").notNull().default(true),
  dataCadastro: timestamp("data_cadastro").notNull().defaultNow(),
  dataAtualizacao: timestamp("data_atualizacao").notNull().defaultNow(),
});

export const pecasUtilizadas = pgTable("pecas_utilizadas", {
  id: serial("id").primaryKey(),
  ordemServicoId: uuid("ordem_servico_id")
    .notNull()
    .references(() => ordensServico.id, { onDelete: "cascade" }),
  pecaId: integer("peca_id")
    .notNull()
    .references(() => pecas.id),
  quantidade: integer("quantidade").notNull(),
  valorUnitario: decimal("valor_unitario", {
    precision: 10,
    scale: 2,
  }).notNull(),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 }).notNull(),
  dataCadastro: timestamp("data_cadastro").notNull().defaultNow(),
});
