import { Ionicons } from '@expo/vector-icons';
import { eq, like } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { db } from '../../../src/lib/db';
import { mockClientes, searchInArray, simulateNetworkDelay } from '../../../src/lib/mockData';
import { clientes, type Cliente } from '../../../src/lib/schema';

export default function ClientesScreen() {
  const [clientesList, setClientesList] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setIsLoading(true);

      // Tenta usar o banco real primeiro
      const resultado = await db
        .select()
        .from(clientes)
        .where(eq(clientes.isAtivo, true))
        .orderBy(clientes.nomeRazaoSocial);

      setClientesList(resultado);
      setUseMockData(false);
    } catch (error) {
      console.warn('Banco não disponível, usando dados de demonstração');

      // Simula delay de rede para demonstração
      await simulateNetworkDelay(800);

      // Usa dados mock
      setClientesList(mockClientes);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarClientes = async (texto: string) => {
    if (!texto.trim()) {
      carregarClientes();
      return;
    }

    try {
      if (useMockData) {
        // Busca nos dados mock
        const resultado = searchInArray(mockClientes, texto, [
          'nomeRazaoSocial',
          'documento',
          'email',
          'telefonePrincipal',
        ]);
        setClientesList(resultado);
      } else {
        // Busca no banco real
        const resultado = await db
          .select()
          .from(clientes)
          .where(like(clientes.nomeRazaoSocial, `%${texto}%`))
          .orderBy(clientes.nomeRazaoSocial);

        setClientesList(resultado);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const renderClienteItem = ({ item }: { item: Cliente }) => (
    <TouchableOpacity
      style={styles.clienteCard}
      onPress={() => router.push(`/clientes/${item.id}`)}
    >
      <View style={styles.clienteHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.nomeRazaoSocial.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteNome}>{item.nomeRazaoSocial}</Text>
          <Text style={styles.clienteDocumento}>
            {item.tipoDocumento}: {item.documento}
          </Text>
          <Text style={styles.clienteTelefone}>{item.telefonePrincipal}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clientes</Text>
          {useMockData && <Text style={styles.demoText}>Modo Demonstração</Text>}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/clientes/novo')}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar clientes..."
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            buscarClientes(text);
          }}
        />
      </View>

      <FlatList
        data={clientesList}
        renderItem={renderClienteItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={carregarClientes}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/clientes/novo')}
            >
              <Text style={styles.emptyButtonText}>Cadastrar primeiro cliente</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  clienteCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  clienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  clienteDocumento: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  clienteTelefone: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  demoText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});
