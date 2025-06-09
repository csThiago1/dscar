import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { clientes } from "./clientes";
import { usuarios } from "./usuarios";
import { veiculos } from "./veiculos";

export const tipoOsEnum = pgEnum("tipo_os_enum", [
  "PARTICULAR",
  "SEGURADORA",
  "GARANTIA_INTERNA",
  "CORTESIA",
]);

export const statusOsEnum = pgEnum("status_os_enum", [
  "ORCAMENTO",
  "AGUARDANDO_APROVACAO_CLIENTE",
  "AGUARDANDO_APROVACAO_SEGURADORA",
  "APROVADA_CLIENTE",
  "APROVADA_SEGURADORA",
  "EM_SERVICO",
  "AGUARDANDO_PECA",
  "SERVICO_CONCLUIDO",
  "PENDENTE_VISTORIA_FINAL",
  "PRONTA_PARA_ENTREGA",
  "ENTREGUE",
  "FATURADA",
  "CANCELADA",
]);

export const ordensServico = pgTable("ordens_servico", {
  id: uuid("id").primaryKey().defaultRandom(),
  clienteId: integer("cliente_id")
    .notNull()
    .references(() => clientes.id),
  veiculoId: integer("veiculo_id")
    .notNull()
    .references(() => veiculos.id),
  tipo: tipoOsEnum("tipo").notNull(),
  status: statusOsEnum("status").notNull().default("ORCAMENTO"),
  quilometragem: integer("quilometragem").notNull(),
  descricaoServico: text("descricao_servico").notNull(),
  valorTotal: decimal("valor_total", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  dataCriacao: timestamp("data_criacao").notNull().defaultNow(),
  dataAtualizacao: timestamp("data_atualizacao").notNull().defaultNow(),
  dataFinalizacao: timestamp("data_finalizacao"),
  tecnicoId: uuid("tecnico_id").references(() => usuarios.id),
  observacoes: text("observacoes"),
});

// Definindo as relações da tabela ordensServico
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

export type OrdemServico = InferSelectModel<typeof ordensServico>;
export type NovaOrdemServico = InferInsertModel<typeof ordensServico>;
