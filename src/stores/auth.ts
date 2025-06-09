import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  _setIsInitialized: (isInitialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email, password) => {
        // Simulação de chamada de API
        console.log('Tentando login com:', { email, password });
        try {
          // TODO: Substituir pela chamada real à API de autenticação
          // const response = await authService.login(email, password);
          // const { user, token } = response.data;

          // Mock de sucesso
          if (email === 'admin@dscar.com' && password === 'admin') {
            const mockUser: User = {
              id: '1',
              name: 'Admin',
              email: 'admin@dscar.com',
            };
            const mockToken = 'fake-jwt-token';

            set({ user: mockUser, token: mockToken, isAuthenticated: true });
            console.log('Login bem-sucedido!');
          } else {
            throw new Error('Credenciais inválidas');
          }
        } catch (error) {
          console.error('Falha no login:', error);
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        console.log('Logout realizado.');
      },

      _setIsInitialized: (isInitialized: boolean) => {
        set({ isInitialized });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          state._setIsInitialized(true);
        }
      },
    }
  )
);

// Inicializa o estado de autenticação na primeira carga
useAuthStore.getState()._setIsInitialized(true);
