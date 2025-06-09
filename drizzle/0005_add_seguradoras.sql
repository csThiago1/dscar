-- Criação da tabela seguradoras
CREATE TABLE IF NOT EXISTS seguradoras (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  is_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserção das seguradoras iniciais
INSERT INTO seguradoras (nome)
VALUES
  ('BRADESCO'),
  ('TOKIO MARINE'),
  ('HDI'),
  ('PORTO'),
  ('AZUL'),
  ('YOUSE'),
  ('YELUM'),
  ('MITSUI')
ON CONFLICT (nome) DO NOTHING; 