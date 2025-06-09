CREATE TABLE IF NOT EXISTS ordens_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_email TEXT,
  veiculo TEXT NOT NULL,
  placa TEXT NOT NULL,
  quilometragem INTEGER NOT NULL,
  descricao_servico TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW(),
  data_finalizacao TIMESTAMP,
  tecnico_id UUID REFERENCES users(id),
  observacoes TEXT
); 