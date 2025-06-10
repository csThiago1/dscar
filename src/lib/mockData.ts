// Dados de exemplo para demonstração (quando o banco não estiver configurado)

export const mockClientes = [
  {
    id: 1,
    nomeRazaoSocial: 'João Silva',
    tipoDocumento: 'CPF' as const,
    documento: '123.456.789-00',
    telefonePrincipal: '(11) 98765-4321',
    telefoneSecundario: null,
    email: 'joao.silva@email.com',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    observacoes: null,
    isAtivo: true,
    dataCadastro: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-01-15'),
  },
  {
    id: 2,
    nomeRazaoSocial: 'Maria Santos',
    tipoDocumento: 'CPF' as const,
    documento: '987.654.321-00',
    telefonePrincipal: '(11) 91234-5678',
    telefoneSecundario: '(11) 3456-7890',
    email: 'maria.santos@email.com',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
    observacoes: 'Cliente preferencial',
    isAtivo: true,
    dataCadastro: new Date('2024-02-10'),
    dataAtualizacao: new Date('2024-02-10'),
  },
  {
    id: 3,
    nomeRazaoSocial: 'Oficina Mecânica ABC Ltda',
    tipoDocumento: 'CNPJ' as const,
    documento: '12.345.678/0001-90',
    telefonePrincipal: '(11) 2345-6789',
    telefoneSecundario: null,
    email: 'contato@oficinaabc.com.br',
    endereco: 'Rua da Indústria, 500 - São Paulo/SP',
    observacoes: 'Empresa parceira',
    isAtivo: true,
    dataCadastro: new Date('2024-03-05'),
    dataAtualizacao: new Date('2024-03-05'),
  },
];

export const mockVeiculos = [
  {
    id: 1,
    clienteId: 1,
    placa: 'ABC-1234',
    marca: 'Toyota',
    modelo: 'Corolla',
    versao: 'XEi 2.0',
    ano: 2020,
    cor: 'Prata',
    quilometragemAtual: 45000,
    chassi: '9BR53ZFC4B8123456',
    motor: '2.0 16V',
    observacoes: null,
    isAtivo: true,
    dataCadastro: new Date('2024-01-15'),
    dataAtualizacao: new Date('2024-01-15'),
  },
  {
    id: 2,
    clienteId: 2,
    placa: 'XYZ-5678',
    marca: 'Honda',
    modelo: 'Civic',
    versao: 'EXL',
    ano: 2019,
    cor: 'Branco',
    quilometragemAtual: 38000,
    chassi: '19XFC2F7XKE123456',
    motor: '2.0 16V',
    observacoes: 'Carro em perfeito estado',
    isAtivo: true,
    dataCadastro: new Date('2024-02-10'),
    dataAtualizacao: new Date('2024-02-10'),
  },
  {
    id: 3,
    clienteId: 1,
    placa: 'DEF-9012',
    marca: 'Volkswagen',
    modelo: 'Golf',
    versao: 'TSI',
    ano: 2021,
    cor: 'Azul',
    quilometragemAtual: 15000,
    chassi: '9BWZZZ377VT123456',
    motor: '1.4 TSI',
    observacoes: 'Segundo veículo do cliente',
    isAtivo: true,
    dataCadastro: new Date('2024-03-01'),
    dataAtualizacao: new Date('2024-03-01'),
  },
];

export const mockOrdensServico = [
  {
    id: 1,
    clienteId: 1,
    veiculoId: 1,
    tecnicoId: null,
    dataEntrada: new Date('2024-01-20'),
    dataPrevistaEntrega: new Date('2024-01-22'),
    dataEntrega: null,
    quilometragem: 45000,
    tipo: 'PARTICULAR' as const,
    descricaoServico: 'Troca de óleo e filtros, revisão geral dos freios',
    observacoes: 'Cliente solicitou verificação de ruído nos freios',
    valorPecas: '150.00',
    valorServicos: '200.00',
    valorTotal: '350.00',
    status: 'EM_SERVICO' as const,
    dataCadastro: new Date('2024-01-20'),
    dataAtualizacao: new Date('2024-01-20'),
  },
  {
    id: 2,
    clienteId: 2,
    veiculoId: 2,
    tecnicoId: null,
    dataEntrada: new Date('2024-01-18'),
    dataPrevistaEntrega: new Date('2024-01-19'),
    dataEntrega: new Date('2024-01-19'),
    quilometragem: 38000,
    tipo: 'PARTICULAR' as const,
    descricaoServico: 'Alinhamento e balanceamento',
    observacoes: null,
    valorPecas: '0.00',
    valorServicos: '120.00',
    valorTotal: '120.00',
    status: 'ENTREGUE' as const,
    dataCadastro: new Date('2024-01-18'),
    dataAtualizacao: new Date('2024-01-19'),
  },
  {
    id: 3,
    clienteId: 3,
    veiculoId: 3,
    tecnicoId: null,
    dataEntrada: new Date('2024-01-25'),
    dataPrevistaEntrega: new Date('2024-01-30'),
    dataEntrega: null,
    quilometragem: 15000,
    tipo: 'GARANTIA_INTERNA' as const,
    descricaoServico: "Troca da correia dentada e bomba d'água",
    observacoes: 'Serviço coberto pela garantia da oficina',
    valorPecas: '300.00',
    valorServicos: '180.00',
    valorTotal: '480.00',
    status: 'ORCAMENTO' as const,
    dataCadastro: new Date('2024-01-25'),
    dataAtualizacao: new Date('2024-01-25'),
  },
];

export const mockAgendamentos = [
  {
    id: 1,
    clienteId: 1,
    data: new Date('2024-02-01'),
    hora: '09:00',
    servico: 'Revisão dos 50.000 km',
    observacoes: 'Cliente prefere horário da manhã',
    status: 'pendente',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: 2,
    clienteId: 2,
    data: new Date('2024-02-02'),
    hora: '14:00',
    servico: 'Troca de pneus',
    observacoes: null,
    status: 'confirmado',
    createdAt: new Date('2024-01-29'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: 3,
    clienteId: 3,
    data: new Date('2024-02-05'),
    hora: '16:00',
    servico: 'Diagnóstico do ar condicionado',
    observacoes: 'Ar condicionado não está gelando',
    status: 'pendente',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// Função auxiliar para simular delay de rede
export const simulateNetworkDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Função para buscar dados com filtro
export const searchInArray = <T extends Record<string, any>>(
  array: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return array;

  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    })
  );
};
