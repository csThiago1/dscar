-- Criar o enum status_os_enum se não existir
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

-- Criar uma tabela temporária com a nova estrutura
CREATE TABLE ordens_servico_new (
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

-- Inserir dados da tabela antiga para a nova com valores padrão
INSERT INTO ordens_servico_new (
    id,
    cliente_id,
    veiculo_id,
    tipo,
    status,
    quilometragem,
    descricao_servico,
    valor_total,
    data_criacao,
    data_atualizacao,
    data_finalizacao,
    tecnico_id,
    observacoes
)
SELECT 
    os.id,
    (SELECT id FROM clientes LIMIT 1) as cliente_id, -- Seleciona o primeiro cliente como padrão
    (SELECT id FROM veiculos LIMIT 1) as veiculo_id, -- Seleciona o primeiro veículo como padrão
    'PARTICULAR'::tipo_os_enum as tipo,
    'ORCAMENTO'::status_os_enum as status,
    os.quilometragem,
    os.descricao_servico,
    os.valor_total,
    os.data_criacao,
    os.data_atualizacao,
    os.data_finalizacao,
    os.tecnico_id,
    os.observacoes
FROM ordens_servico os;

-- Remover a tabela antiga e renomear a nova
DROP TABLE ordens_servico;
ALTER TABLE ordens_servico_new RENAME TO ordens_servico; 