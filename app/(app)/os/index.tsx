import { statusOrdemServicoEnum } from '@/db/schema';
import { useOSStore, type OrdemServicoCompleta } from '@/stores/os';
import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Card, FAB } from 'react-native-paper';

type StatusOrdemServico = (typeof statusOrdemServicoEnum.enumValues)[number];

const statusLabels: Record<StatusOrdemServico, string> = {
  ORCAMENTO: 'Orçamento',
  APROVADA_CLIENTE: 'Aprovada pelo Cliente',
  EM_SERVICO: 'Em Serviço',
  SERVICO_CONCLUIDO: 'Serviço Concluído',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
};

const statusColors: Record<StatusOrdemServico, string> = {
  ORCAMENTO: '#FFA500',
  APROVADA_CLIENTE: '#4CAF50',
  EM_SERVICO: '#2196F3',
  SERVICO_CONCLUIDO: '#9C27B0',
  ENTREGUE: '#4CAF50',
  CANCELADA: '#F44336',
};

type OrdemServico = {
  id: number;
  clienteId: number;
  veiculoId: number;
  dataEntrada: string;
  dataPrevistaEntrega: string | null;
  dataEntrega: string | null;
  quilometragem: number;
  descricaoServico: string;
  observacoes: string | null;
  valorPecas: string;
  valorServicos: string;
  valorTotal: string;
  status: StatusOrdemServico;
  cliente: {
    nomeRazaoSocial: string;
    telefonePrincipal: string;
    email: string | null;
  };
  veiculo: {
    marca: string;
    modelo: string;
    placa: string;
  };
};

export default function OSListScreen() {
  const router = useRouter();
  const { ordens, isLoading, error, fetchOrdens } = useOSStore();

  useEffect(() => {
    fetchOrdens();
  }, [fetchOrdens]);

  const renderItem = ({ item }: { item: OrdemServicoCompleta }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/os/[id]', params: { id: item.id } })}
    >
      <Card style={styles.card}>
        <Card.Title
          title={`OS #${item.id} - ${item.veiculo.placa}`}
          subtitle={item.cliente.nomeRazaoSocial}
        />
        <Card.Content>
          <Text>Modelo: {item.veiculo.modelo}</Text>
          <Text>Status: {item.status}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading && ordens.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Erro ao carregar as Ordens de Serviço.</Text>
        <Button onPress={fetchOrdens}>Tentar Novamente</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ordens}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchOrdens} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>Nenhuma Ordem de Serviço encontrada.</Text>
          </View>
        }
      />
      <Link href="/os/nova" asChild>
        <FAB icon="plus" style={styles.fab} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 8,
  },
  card: {
    margin: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
