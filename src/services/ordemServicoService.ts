import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index';
import { ordensServico, pecasUtilizadas, type OrdemServico } from '../db/schema';
// Services removidos temporariamente

export class OrdemServicoServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrdemServicoServiceError';
  }
}

export interface OrdemServicoDetalhes {
  id: number;
  cliente: {
    nome: string;
  } | null;
  veiculo: {
    placa: string;
    marca: string;
    modelo: string;
  } | null;
  dataEntrada: Date;
  dataPrevistaEntrega: Date | null;
  dataEntrega: Date | null;
  quilometragem: number;
  descricaoServico: string;
  observacoes: string | null;
  valorPecas: string;
  valorServicos: string;
  valorTotal: string;
  status:
    | 'ORCAMENTO'
    | 'APROVADA_CLIENTE'
    | 'EM_SERVICO'
    | 'SERVICO_CONCLUIDO'
    | 'ENTREGUE'
    | 'CANCELADA';
}

export const ordemServicoService = {
  async getAll() {
    try {
      const result = await db.query.ordensServico.findMany({
        with: {
          cliente: true,
          veiculo: true,
        },
        orderBy: [desc(ordensServico.dataEntrada)],
      });
      return result;
    } catch (error) {
      console.error('Erro ao buscar ordens de serviço:', error);
      throw new Error('Não foi possível buscar as ordens de serviço.');
    }
  },

  async getById(id: number) {
    try {
      const result = await db.query.ordensServico.findFirst({
        where: eq(ordensServico.id, id),
        with: {
          cliente: true,
          veiculo: true,
        },
      });
      if (!result) throw new Error('Ordem de serviço não encontrada.');
      return result;
    } catch (error) {
      console.error(`Erro ao buscar ordem de serviço ${id}:`, error);
      throw error;
    }
  },

  async getPecasByOS(osId: number) {
    try {
      const result = await db.query.pecasUtilizadas.findMany({
        where: eq(pecasUtilizadas.ordemServicoId, osId),
        with: {
          peca: true,
        },
      });
      return result;
    } catch (error) {
      console.error(`Erro ao buscar peças da OS ${osId}:`, error);
      throw new Error('Não foi possível buscar as peças da ordem de serviço.');
    }
  },

  async create(data: typeof ordensServico.$inferInsert) {
    try {
      const result = await db.insert(ordensServico).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error);
      throw new Error('Não foi possível criar a ordem de serviço.');
    }
  },

  async update(id: number, data: Partial<typeof ordensServico.$inferInsert>) {
    try {
      const result = await db
        .update(ordensServico)
        .set({ ...data, dataAtualizacao: new Date() })
        .where(eq(ordensServico.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error(`Erro ao atualizar ordem de serviço ${id}:`, error);
      throw new Error('Não foi possível atualizar a ordem de serviço.');
    }
  },

  async delete(id: number) {
    try {
      const result = await this.update(id, { status: 'CANCELADA' });
      return result;
    } catch (error) {
      console.error(`Erro ao cancelar ordem de serviço ${id}:`, error);
      throw new Error('Não foi possível cancelar a ordem de serviço.');
    }
  },

  async atualizarStatus(
    id: number,
    status:
      | 'ORCAMENTO'
      | 'APROVADA_CLIENTE'
      | 'EM_SERVICO'
      | 'SERVICO_CONCLUIDO'
      | 'ENTREGUE'
      | 'CANCELADA'
  ): Promise<OrdemServico> {
    try {
      const results = await db
        .update(ordensServico)
        .set({
          status,
          dataAtualizacao: new Date(),
        })
        .where(eq(ordensServico.id, id))
        .returning();

      return results[0];
    } catch (error) {
      throw new OrdemServicoServiceError('Erro ao atualizar status da ordem de serviço: ' + error);
    }
  },

  async finalizar(id: number): Promise<OrdemServico> {
    try {
      const results = await db
        .update(ordensServico)
        .set({
          status: 'SERVICO_CONCLUIDO',
          dataEntrega: new Date(),
          dataAtualizacao: new Date(),
        })
        .where(eq(ordensServico.id, id))
        .returning();

      return results[0];
    } catch (error) {
      throw new OrdemServicoServiceError('Erro ao finalizar ordem de serviço: ' + error);
    }
  },
};
