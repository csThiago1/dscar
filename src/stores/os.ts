import { create } from 'zustand';

import type { Cliente, OrdemServico, Peca, PecaUtilizada, Veiculo } from '@/db/schema';
import { ordemServicoService } from '@/services/ordemServicoService';

// Tipo para Ordem de Serviço com relações carregadas
export type OrdemServicoCompleta = OrdemServico & {
  cliente: Cliente;
  veiculo: Veiculo;
  pecasUtilizadas?: (PecaUtilizada & { peca: Peca })[];
};

interface OSState {
  ordens: OrdemServicoCompleta[];
  ordemAtual: OrdemServicoCompleta | null;
  isLoading: boolean;
  error: string | null;
  fetchOrdens: () => Promise<void>;
  fetchOrdemById: (id: number) => Promise<void>;
  createOrdem: (data: Parameters<typeof ordemServicoService.create>[0]) => Promise<void>;
  updateOrdem: (
    id: number,
    data: Parameters<typeof ordemServicoService.update>[1]
  ) => Promise<void>;
  deleteOrdem: (id: number) => Promise<void>;
}

export const useOSStore = create<OSState>((set, get) => ({
  ordens: [],
  ordemAtual: null,
  isLoading: false,
  error: null,

  fetchOrdens: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await ordemServicoService.getAll();
      set({ ordens: data as unknown as OrdemServicoCompleta[], isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  fetchOrdemById: async (id: number) => {
    set({ isLoading: true, error: null, ordemAtual: null });
    try {
      const data = await ordemServicoService.getById(id);
      const pecas = await ordemServicoService.getPecasByOS(id);
      const ordemCompleta = { ...data, pecasUtilizadas: pecas };
      set({ ordemAtual: ordemCompleta as unknown as OrdemServicoCompleta, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },

  createOrdem: async data => {
    set({ isLoading: true, error: null });
    try {
      await ordemServicoService.create(data);
      await get().fetchOrdens();
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrdem: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await ordemServicoService.update(id, data);
      await get().fetchOrdemById(id);
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteOrdem: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await ordemServicoService.delete(id);
      await get().fetchOrdens();
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
    }
  },
}));
