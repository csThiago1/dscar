CREATE TYPE "public"."status_ordem_servico" AS ENUM('ORCAMENTO', 'APROVADA_CLIENTE', 'EM_SERVICO', 'SERVICO_CONCLUIDO', 'ENTREGUE', 'CANCELADA');--> statement-breakpoint
CREATE TYPE "public"."tipo_documento" AS ENUM('CPF', 'CNPJ');--> statement-breakpoint
CREATE TYPE "public"."unidade_medida" AS ENUM('UN', 'PC', 'CX', 'KG', 'L', 'M', 'M2', 'M3');--> statement-breakpoint
CREATE TABLE "agendamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"cliente_id" integer NOT NULL,
	"data" date NOT NULL,
	"hora" varchar(5) NOT NULL,
	"servico" varchar(255) NOT NULL,
	"observacoes" text,
	"status" varchar(20) DEFAULT 'pendente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pecas" (
	"id" serial PRIMARY KEY NOT NULL,
	"codigo" varchar(50) NOT NULL,
	"nome" varchar(100) NOT NULL,
	"descricao" text,
	"unidade_medida" "unidade_medida" NOT NULL,
	"quantidade_estoque" integer DEFAULT 0 NOT NULL,
	"preco_compra" numeric(10, 2) NOT NULL,
	"preco_venda" numeric(10, 2) NOT NULL,
	"estoque_minimo" integer DEFAULT 0 NOT NULL,
	"localizacao" varchar(50),
	"observacoes" text,
	"is_ativo" boolean DEFAULT true NOT NULL,
	"data_cadastro" timestamp DEFAULT now() NOT NULL,
	"data_atualizacao" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pecas_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(100) NOT NULL,
	"descricao" text,
	"preco_base" numeric(10, 2) NOT NULL,
	"tempo_estimado" integer,
	"categoria" varchar(50),
	"is_ativo" boolean DEFAULT true NOT NULL,
	"data_cadastro" timestamp DEFAULT now() NOT NULL,
	"data_atualizacao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_role_enum" DEFAULT 'CONSULTOR' NOT NULL,
	"data_cadastro" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "checklist_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "checklist_items" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP CONSTRAINT "ordens_servico_tecnico_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "veiculos" DROP CONSTRAINT "veiculos_proprietario_principal_id_clientes_id_fk";
--> statement-breakpoint
DROP INDEX "idx_veiculos_chassi_unico";--> statement-breakpoint
DROP INDEX "idx_veiculos_renavam_unico";--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "tipo_documento" SET DATA TYPE "public"."tipo_documento" USING "tipo_documento"::text::"public"."tipo_documento";--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "tipo_documento" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "documento" SET DATA TYPE varchar(14);--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "nome_razao_social" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "telefone_principal" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "telefone_secundario" SET DATA TYPE varchar(15);--> statement-breakpoint
ALTER TABLE "clientes" ALTER COLUMN "email" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "tipo" SET DEFAULT 'PARTICULAR';--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "status" SET DATA TYPE "public"."status_ordem_servico" USING "status"::text::"public"."status_ordem_servico";--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "status" SET DEFAULT 'ORCAMENTO';--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "valor_total" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_atualizacao" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_atualizacao" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "veiculos" ALTER COLUMN "modelo" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "veiculos" ALTER COLUMN "versao" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "veiculos" ALTER COLUMN "motor" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "veiculos" ALTER COLUMN "chassi" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "veiculos" ALTER COLUMN "data_cadastro" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "veiculos" ALTER COLUMN "data_cadastro" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "clientes" ADD COLUMN "endereco" text;--> statement-breakpoint
ALTER TABLE "clientes" ADD COLUMN "data_cadastro" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "clientes" ADD COLUMN "data_atualizacao" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "data_entrada" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "data_prevista_entrega" timestamp;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "data_entrega" timestamp;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "valor_pecas" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "valor_servicos" numeric(10, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "data_cadastro" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "veiculos" ADD COLUMN "cliente_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "veiculos" ADD COLUMN "ano" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "veiculos" ADD COLUMN "data_atualizacao" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_pecas_codigo_unico" ON "pecas" USING btree ("codigo");--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD CONSTRAINT "ordens_servico_tecnico_id_usuarios_id_fk" FOREIGN KEY ("tecnico_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "nome_fantasia";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "logradouro";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "numero";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "complemento";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "bairro";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "cidade";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "estado";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "cep";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "data_nascimento_fundacao";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "inscricao_estadual";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "inscricao_municipal";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "clientes" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "data_criacao";--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "data_finalizacao";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "plataforma";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "combustivel";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "ano_fabricacao";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "ano_modelo";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "renavam";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "proprietario_principal_id";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "data_ultima_atualizacao_km";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "veiculos" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_documento_unique" UNIQUE("documento");--> statement-breakpoint
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_placa_unique" UNIQUE("placa");--> statement-breakpoint
DROP TYPE "public"."combustivel_veiculo_enum";--> statement-breakpoint
DROP TYPE "public"."localizacao_veiculo_os_enum";--> statement-breakpoint
DROP TYPE "public"."plataforma_veiculo_enum";--> statement-breakpoint
DROP TYPE "public"."status_checklist_item_enum";--> statement-breakpoint
DROP TYPE "public"."status_os_enum";--> statement-breakpoint
DROP TYPE "public"."tipo_documento_cliente_enum";--> statement-breakpoint
DROP TYPE "public"."tipo_envolvimento_seguro_enum";