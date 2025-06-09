ALTER TABLE "ordens_servico" ALTER COLUMN "status" SET DEFAULT 'ORCAMENTO'::"public"."status_os_enum";--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "status" SET DATA TYPE "public"."status_os_enum" USING "status"::"public"."status_os_enum";--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_criacao" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_criacao" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_atualizacao" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_atualizacao" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ordens_servico" ALTER COLUMN "data_finalizacao" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "cliente_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "veiculo_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD COLUMN "tipo" "tipo_os_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD CONSTRAINT "ordens_servico_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordens_servico" ADD CONSTRAINT "ordens_servico_veiculo_id_veiculos_id_fk" FOREIGN KEY ("veiculo_id") REFERENCES "public"."veiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "cliente_nome";--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "cliente_telefone";--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "cliente_email";--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "veiculo";--> statement-breakpoint
ALTER TABLE "ordens_servico" DROP COLUMN "placa";