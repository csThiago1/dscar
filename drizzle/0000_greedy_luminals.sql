CREATE TYPE "public"."combustivel_veiculo_enum" AS ENUM('GASOLINA', 'ETANOL', 'DIESEL', 'GNV', 'ELETRICO', 'FLEX', 'HIBRIDO', 'OUTRO');--> statement-breakpoint
CREATE TYPE "public"."localizacao_veiculo_os_enum" AS ENUM('OFICINA', 'PATIO_INTERNO', 'PATIO_EXTERNO', 'CLIENTE', 'TERCEIRO');--> statement-breakpoint
CREATE TYPE "public"."plataforma_veiculo_enum" AS ENUM('HATCH', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'MOTO', 'UTILITARIO_LEVE', 'CAMINHAO_LEVE', 'OUTRO');--> statement-breakpoint
CREATE TYPE "public"."status_checklist_item_enum" AS ENUM('OK', 'AVARIADO', 'AUSENTE', 'NAO_APLICA');--> statement-breakpoint
CREATE TYPE "public"."status_os_enum" AS ENUM('ORCAMENTO', 'AGUARDANDO_APROVACAO_CLIENTE', 'AGUARDANDO_APROVACAO_SEGURADORA', 'APROVADA_CLIENTE', 'APROVADA_SEGURADORA', 'EM_SERVICO', 'AGUARDANDO_PECA', 'SERVICO_CONCLUIDO', 'PENDENTE_VISTORIA_FINAL', 'PRONTA_PARA_ENTREGA', 'ENTREGUE', 'FATURADA', 'CANCELADA');--> statement-breakpoint
CREATE TYPE "public"."tipo_documento_cliente_enum" AS ENUM('CPF', 'CNPJ');--> statement-breakpoint
CREATE TYPE "public"."tipo_envolvimento_seguro_enum" AS ENUM('SEGURADO', 'TERCEIRO');--> statement-breakpoint
CREATE TYPE "public"."tipo_os_enum" AS ENUM('PARTICULAR', 'SEGURADORA', 'GARANTIA_INTERNA', 'CORTESIA');--> statement-breakpoint
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'CONSULTOR', 'TECNICO');
    END IF;
END $$;
CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo_documento" "tipo_documento_cliente_enum",
	"documento" varchar(20) NOT NULL,
	"nome_razao_social" varchar(255) NOT NULL,
	"nome_fantasia" varchar(255),
	"telefone_principal" varchar(20) NOT NULL,
	"telefone_secundario" varchar(20),
	"email" varchar(255),
	"logradouro" varchar(200),
	"numero" varchar(20),
	"complemento" varchar(100),
	"bairro" varchar(100),
	"cidade" varchar(100),
	"estado" varchar(2),
	"cep" varchar(9),
	"data_nascimento_fundacao" date,
	"inscricao_estadual" varchar(20),
	"inscricao_municipal" varchar(20),
	"observacoes" text,
	"is_ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ordens_servico" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_nome" text NOT NULL,
	"cliente_telefone" text NOT NULL,
	"cliente_email" text,
	"veiculo" text NOT NULL,
	"placa" text NOT NULL,
	"quilometragem" integer NOT NULL,
	"descricao_servico" text NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"valor_total" numeric(10, 2) DEFAULT '0' NOT NULL,
	"data_criacao" timestamp DEFAULT now() NOT NULL,
	"data_atualizacao" timestamp DEFAULT now() NOT NULL,
	"data_finalizacao" timestamp,
	"tecnico_id" uuid,
	"observacoes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" user_role_enum,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "veiculos" (
	"id" serial PRIMARY KEY NOT NULL,
	"placa" varchar(10) NOT NULL,
	"marca" varchar(50) NOT NULL,
	"modelo" varchar(100) NOT NULL,
	"versao" varchar(100),
	"plataforma" "plataforma_veiculo_enum",
	"motor" varchar(50),
	"combustivel" "combustivel_veiculo_enum",
	"ano_fabricacao" integer,
	"ano_modelo" integer,
	"chassi" varchar(17) NOT NULL,
	"cor" varchar(50),
	"renavam" varchar(11),
	"proprietario_principal_id" integer,
	"data_cadastro" timestamp with time zone DEFAULT now() NOT NULL,
	"quilometragem_atual" integer,
	"data_ultima_atualizacao_km" timestamp with time zone,
	"observacoes" text,
	"is_ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD CONSTRAINT "ordens_servico_tecnico_id_users_id_fk" FOREIGN KEY ("tecnico_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_proprietario_principal_id_clientes_id_fk" FOREIGN KEY ("proprietario_principal_id") REFERENCES "public"."clientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_clientes_documento_unico" ON "clientes" USING btree ("documento");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_veiculos_placa_unica" ON "veiculos" USING btree ("placa");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_veiculos_chassi_unico" ON "veiculos" USING btree ("chassi");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_veiculos_renavam_unico" ON "veiculos" USING btree ("renavam");