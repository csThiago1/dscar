/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Ionicons } from '@expo/vector-icons';
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

import { mockOrdensServico, searchInArray, simulateNetworkDelay } from '../../../src/lib/mockData';

interface OrdemServico {
  id: number;
  clienteId: number;
  veiculoId: number;
  tecnicoId: number | null;
  dataEntrada: Date;
  dataPrevistaEntrega: Date;
  dataEntrega: Date | null;
  quilometragem: number;
  tipo: 'PARTICULAR' | 'GARANTIA_INTERNA' | 'GARANTIA_CONCESSIONARIA' | 'CAMPANHA' | 'RECALL';
  descricaoServico: string;
  observacoes: string | null;
  valorPecas: string;
  valorServicos: string;
  valorTotal: string;
  status:
    | 'ORCAMENTO'
    | 'APROVADO'
    | 'EM_SERVICO'
    | 'AGUARDANDO_PECA'
    | 'PRONTO'
    | 'ENTREGUE'
    | 'CANCELADO';
  dataCadastro: Date;
  dataAtualizacao: Date;
}

export default function OrdensServicoScreen() {
  const [ordensList, setOrdensList] = useState<OrdemServico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  useEffect(() => {
    carregarOrdens();
  }, []);

  const carregarOrdens = async () => {
    try {
      setIsLoading(true);
      await simulateNetworkDelay(800);
      setOrdensList(mockOrdensServico);
    } catch (error) {
      console.error('Erro ao carregar ordens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarOrdens = async (texto: string) => {
    if (!texto.trim()) {
      carregarOrdens();
      return;
    }

    try {
      const resultado = searchInArray(mockOrdensServico, texto, [
        'descricaoServico',
        'observacoes',
        'status',
      ]);
      setOrdensList(resultado);
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORCAMENTO':
        return '#6366f1';
      case 'APROVADO':
        return '#0ea5e9';
      case 'EM_SERVICO':
        return '#eab308';
      case 'PRONTO':
        return '#059669';
      case 'ENTREGUE':
        return '#10b981';
      case 'CANCELADO':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(data);
  };

  const formatarValor = (valor: string) => {
    const numero = parseFloat(valor);
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderOrdemItem = ({ item }: { item: OrdemServico }) => (
    <TouchableOpacity
      style={styles.ordemCard}
      onPress={() => router.push(`/(app)/ordens-servico/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.ordemInfo}>
          <Text style={styles.ordemNumero}>OS #{item.id}</Text>
          <Text style={styles.ordemData}>{formatarData(item.dataEntrada)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.descricaoText} numberOfLines={2}>
          {item.descricaoServico}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.valorText}>{formatarValor(item.valorTotal)}</Text>
          <View style={styles.tipoContainer}>
            <Text style={styles.tipoText}>{item.tipo}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando ordens de serviço...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ordens de Serviço</Text>
          <Text style={styles.demoText}>Modo Demonstração</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(app)/ordens-servico/nova')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar ordens..."
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            buscarOrdens(text);
          }}
        />
      </View>

      <FlatList
        data={ordensList}
        renderItem={renderOrdemItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={carregarOrdens}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>Nenhuma ordem de serviço encontrada</Text>
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
  demoText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
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
  ordemCard: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ordemInfo: {
    flex: 1,
  },
  ordemNumero: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  ordemData: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    marginTop: 4,
  },
  descricaoText: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  tipoContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tipoText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
    marginTop: 16,
    textAlign: 'center',
  },
});
