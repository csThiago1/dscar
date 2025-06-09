CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  valor_padrao DECIMAL(10,2) NOT NULL,
  tempo_medio_minutos INTEGER,
  categoria VARCHAR(50),
  is_ativo BOOLEAN NOT NULL DEFAULT true,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicos_realizados (
  id SERIAL PRIMARY KEY,
  ordem_servico_id UUID NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
  servico_id INTEGER NOT NULL REFERENCES servicos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  observacao TEXT,
  data_cadastro TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_servicos_codigo ON servicos(codigo);
CREATE INDEX IF NOT EXISTS idx_servicos_realizados_ordem_servico ON servicos_realizados(ordem_servico_id);
CREATE INDEX IF NOT EXISTS idx_servicos_realizados_servico ON servicos_realizados(servico_id); 