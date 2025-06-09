import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, Text, Title } from 'react-native-paper';

import { statusOrdemServicoEnum } from '@/db/schema';
import { useOSStore } from '@/stores/os';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

export default function OSDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { ordemAtual, isLoading, error, fetchOrdemById } = useOSStore();

  const osId = Number(id);

  useEffect(() => {
    if (osId) {
      fetchOrdemById(osId);
    }
  }, [osId]);

  if (isLoading || !ordemAtual) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Erro ao carregar a Ordem de Serviço.</Text>
        <Button onPress={() => fetchOrdemById(osId)}>Tentar Novamente</Button>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em andamento':
        return '#f4511e';
      case 'concluída':
        return '#4caf50';
      case 'aguardando peças':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={() => fetchOrdemById(osId)} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title>
            OS #{ordemAtual.id} - {ordemAtual.status}
          </Title>
          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text>{ordemAtual.cliente.nomeRazaoSocial}</Text>
          <Text>{ordemAtual.cliente.telefonePrincipal}</Text>
          {ordemAtual.cliente.email && <Text>{ordemAtual.cliente.email}</Text>}

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Veículo</Text>
          <Text>
            {ordemAtual.veiculo.marca} {ordemAtual.veiculo.modelo}
          </Text>
          <Text>Placa: {ordemAtual.veiculo.placa}</Text>
          <Text>KM: {ordemAtual.quilometragem}</Text>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Serviços</Text>
          <Text>{ordemAtual.descricaoServico}</Text>
          {ordemAtual.observacoes && <Text>Obs: {ordemAtual.observacoes}</Text>}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Valores</Text>
          <Text>Peças: R$ {String(ordemAtual.valorPecas)}</Text>
          <Text>Serviços: R$ {String(ordemAtual.valorServicos)}</Text>
          <Title>Total: R$ {String(ordemAtual.valorTotal)}</Title>
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/os/editar/${ordemAtual.id}`)}
        >
          <Ionicons name="create" size={24} color="#fff" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.checklistButton]}
          onPress={() => router.push(`/os/checklist/${ordemAtual.id}`)}
        >
          <Ionicons name="checkbox" size={24} color="#fff" />
          <Text style={styles.buttonText}>Checklist</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
  divider: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#f4511e',
  },
  checklistButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
