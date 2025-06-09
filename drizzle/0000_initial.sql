-- Criar os tipos enum
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'CONSULTOR', 'TECNICO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_documento_cliente_enum AS ENUM ('CPF', 'CNPJ');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plataforma_veiculo_enum AS ENUM (
        'HATCH', 'SEDAN', 'SUV', 'PICKUP', 'VAN', 'MOTO', 'UTILITARIO_LEVE', 'CAMINHAO_LEVE', 'OUTRO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE combustivel_veiculo_enum AS ENUM (
        'GASOLINA', 'ETANOL', 'DIESEL', 'GNV', 'ELETRICO', 'FLEX', 'HIBRIDO', 'OUTRO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE tipo_os_enum AS ENUM (
        'PARTICULAR', 'SEGURADORA', 'GARANTIA_INTERNA', 'CORTESIA'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_os_enum AS ENUM (
        'ORCAMENTO',
        'AGUARDANDO_APROVACAO_CLIENTE',
        'AGUARDANDO_APROVACAO_SEGURADORA',
        'APROVADA_CLIENTE',
        'APROVADA_SEGURADORA',
        'EM_SERVICO',
        'AGUARDANDO_PECA',
        'SERVICO_CONCLUIDO',
        'PENDENTE_VISTORIA_FINAL',
        'PRONTA_PARA_ENTREGA',
        'ENTREGUE',
        'FATURADA',
        'CANCELADA'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password text NOT NULL,
    role user_role_enum,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT idx_users_email_unique UNIQUE (email)
);

-- Criar tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id serial PRIMARY KEY,
    tipo_documento tipo_documento_cliente_enum,
    documento varchar(20) NOT NULL,
    nome_razao_social varchar(255) NOT NULL,
    nome_fantasia varchar(255),
    telefone_principal varchar(20) NOT NULL,
    telefone_secundario varchar(20),
    email varchar(255),
    logradouro varchar(200),
    numero varchar(20),
    complemento varchar(100),
    bairro varchar(100),
    cidade varchar(100),
    estado varchar(2),
    cep varchar(9),
    data_nascimento_fundacao date,
    inscricao_estadual varchar(20),
    inscricao_municipal varchar(20),
    observacoes text,
    is_ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT idx_clientes_documento_unico UNIQUE (documento)
);

-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id serial PRIMARY KEY,
    placa varchar(10) NOT NULL,
    marca varchar(50) NOT NULL,
    modelo varchar(100) NOT NULL,
    versao varchar(100),
    plataforma plataforma_veiculo_enum,
    motor varchar(50),
    combustivel combustivel_veiculo_enum,
    ano_fabricacao integer,
    ano_modelo integer,
    chassi varchar(17) NOT NULL,
    cor varchar(50),
    renavam varchar(11),
    proprietario_principal_id integer REFERENCES clientes(id) ON DELETE SET NULL,
    data_cadastro timestamp with time zone DEFAULT now() NOT NULL,
    quilometragem_atual integer,
    data_ultima_atualizacao_km timestamp with time zone,
    observacoes text,
    is_ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT idx_veiculos_placa_unica UNIQUE (placa),
    CONSTRAINT idx_veiculos_chassi_unico UNIQUE (chassi),
    CONSTRAINT idx_veiculos_renavam_unico UNIQUE (renavam)
);

-- Criar tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS ordens_servico (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id integer NOT NULL REFERENCES clientes(id),
    veiculo_id integer NOT NULL REFERENCES veiculos(id),
    tipo tipo_os_enum NOT NULL,
    status status_os_enum NOT NULL DEFAULT 'ORCAMENTO',
    quilometragem integer NOT NULL,
    descricao_servico text NOT NULL,
    valor_total decimal(10,2) NOT NULL DEFAULT 0,
    data_criacao timestamp with time zone NOT NULL DEFAULT now(),
    data_atualizacao timestamp with time zone NOT NULL DEFAULT now(),
    data_finalizacao timestamp with time zone,
    tecnico_id uuid REFERENCES users(id),
    observacoes text
);

CREATE TYPE "tipo_documento" AS ENUM ('CPF', 'CNPJ');
CREATE TYPE "status_ordem_servico" AS ENUM ('ORCAMENTO', 'APROVADA_CLIENTE', 'EM_SERVICO', 'SERVICO_CONCLUIDO', 'ENTREGUE', 'CANCELADA');
CREATE TYPE "unidade_medida" AS ENUM ('UN', 'PC', 'CX', 'KG', 'L', 'M', 'M2', 'M3');

CREATE TABLE IF NOT EXISTS "pecas" (
  "id" SERIAL PRIMARY KEY,
  "codigo" VARCHAR(30) NOT NULL UNIQUE,
  "nome" VARCHAR(100) NOT NULL,
  "descricao" TEXT,
  "unidade_medida" unidade_medida NOT NULL,
  "quantidade_estoque" INTEGER NOT NULL DEFAULT 0,
  "preco_compra" DECIMAL(10,2) NOT NULL,
  "preco_venda" DECIMAL(10,2) NOT NULL,
  "estoque_minimo" INTEGER NOT NULL DEFAULT 0,
  "estoque_maximo" INTEGER,
  "localizacao" VARCHAR(50),
  "observacoes" TEXT,
  "data_ultima_movimentacao" TIMESTAMP,
  "is_ativo" BOOLEAN NOT NULL DEFAULT true,
  "data_cadastro" TIMESTAMP NOT NULL DEFAULT NOW(),
  "data_atualizacao" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "pecas_utilizadas" (
  "id" SERIAL PRIMARY KEY,
  "ordem_servico_id" INTEGER NOT NULL REFERENCES "ordens_servico"("id"),
  "peca_id" INTEGER NOT NULL REFERENCES "pecas"("id"),
  "quantidade" INTEGER NOT NULL,
  "valor_unitario" DECIMAL(10,2) NOT NULL,
  "valor_total" DECIMAL(10,2) NOT NULL,
  "data_cadastro" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_clientes_documento" ON "clientes"("documento");
CREATE INDEX IF NOT EXISTS "idx_veiculos_placa" ON "veiculos"("placa");
CREATE INDEX IF NOT EXISTS "idx_pecas_codigo" ON "pecas"("codigo");
CREATE INDEX IF NOT EXISTS "idx_ordens_servico_cliente" ON "ordens_servico"("cliente_id");
CREATE INDEX IF NOT EXISTS "idx_ordens_servico_veiculo" ON "ordens_servico"("veiculo_id");
CREATE INDEX IF NOT EXISTS "idx_ordens_servico_status" ON "ordens_servico"("status");
CREATE INDEX IF NOT EXISTS "idx_pecas_utilizadas_ordem_servico" ON "pecas_utilizadas"("ordem_servico_id");
CREATE INDEX IF NOT EXISTS "idx_pecas_utilizadas_peca" ON "pecas_utilizadas"("peca_id"); 