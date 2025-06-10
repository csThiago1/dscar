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

import { db } from '../../../src/lib/db';
import { mockVeiculos, searchInArray, simulateNetworkDelay } from '../../../src/lib/mockData';
import { veiculos, type Veiculo } from '../../../src/lib/schema';

export default function VeiculosScreen() {
  const [veiculosList, setVeiculosList] = useState<Veiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    try {
      setIsLoading(true);

      const resultado = await db.select().from(veiculos).orderBy(veiculos.placa);

      setVeiculosList(resultado);
      setUseMockData(false);
    } catch (error) {
      console.warn('Banco não disponível, usando dados de demonstração');

      await simulateNetworkDelay(800);

      setVeiculosList(mockVeiculos);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarVeiculos = async (texto: string) => {
    if (!texto.trim()) {
      carregarVeiculos();
      return;
    }

    try {
      if (useMockData) {
        const resultado = searchInArray(mockVeiculos, texto, [
          'placa',
          'marca',
          'modelo',
          'versao',
        ]);
        setVeiculosList(resultado);
      } else {
        // Busca no banco real seria aqui
        setVeiculosList([]);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const renderVeiculoItem = ({ item }: { item: Veiculo }) => (
    <TouchableOpacity
      style={styles.veiculoCard}
      onPress={() => router.push(`/(app)/veiculos/${item.id}`)}
    >
      <View style={styles.veiculoHeader}>
        <View style={styles.placaContainer}>
          <Text style={styles.placaText}>{item.placa}</Text>
        </View>
        <View style={styles.veiculoInfo}>
          <Text style={styles.veiculoNome}>
            {item.marca} {item.modelo}
          </Text>
          <Text style={styles.veiculoVersao}>
            {item.versao} - {item.ano}
          </Text>
          <Text style={styles.veiculoCor}>Cor: {item.cor}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando veículos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Veículos</Text>
          {useMockData && <Text style={styles.demoText}>Modo Demonstração</Text>}
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar veículos..."
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            buscarVeiculos(text);
          }}
        />
      </View>

      <FlatList
        data={veiculosList}
        renderItem={renderVeiculoItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={carregarVeiculos}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>Nenhum veículo encontrado</Text>
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
  veiculoCard: {
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
  veiculoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placaContainer: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  placaText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  veiculoInfo: {
    flex: 1,
  },
  veiculoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  veiculoVersao: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  veiculoCor: {
    fontSize: 14,
    color: '#6b7280',
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
