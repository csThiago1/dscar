import { Ionicons } from '@expo/vector-icons';
import { eq } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { db } from '../../../src/lib/db';
import { clientes, ordensServico, veiculos } from '../../../src/lib/schema';

interface Cliente {
  id: number;
  nomeRazaoSocial: string;
  email: string | null;
  telefonePrincipal: string;
}

interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  clienteId: number;
}

export default function NovaOrdemServicoScreen() {
  const router = useRouter();

  const [clientesSelecionaveis, setClientesSelecionaveis] = useState<Cliente[]>([]);
  const [veiculosSelecionaveis, setVeiculosSelecionaveis] = useState<Veiculo[]>([]);

  const [clienteId, setClienteId] = useState<number | null>(null);
  const [veiculoId, setVeiculoId] = useState<number | null>(null);
  const [descricao, setDescricao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [valorTotal, setValorTotal] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showClientesList, setShowClientesList] = useState(false);
  const [showVeiculosList, setShowVeiculosList] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (clienteId) {
      carregarVeiculosDoCliente();
    } else {
      setVeiculosSelecionaveis([]);
      setVeiculoId(null);
    }
  }, [clienteId]);

  const carregarDados = async () => {
    try {
      const resultadoClientes = await db.select().from(clientes);
      setClientesSelecionaveis(resultadoClientes);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar os clientes');
    } finally {
      setIsLoadingData(false);
    }
  };

  const carregarVeiculosDoCliente = async () => {
    if (!clienteId) return;

    try {
      const resultadoVeiculos = await db
        .select()
        .from(veiculos)
        .where(eq(veiculos.clienteId, clienteId));
      setVeiculosSelecionaveis(resultadoVeiculos);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os veículos');
    }
  };

  const criarOrdemServico = async () => {
    if (!clienteId || !veiculoId || !descricao.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      const valor = parseFloat(valorTotal.replace(',', '.')) || 0;

      await db.insert(ordensServico).values({
        clienteId,
        veiculoId,
        quilometragem: 0,
        descricaoServico: descricao.trim(),
        observacoes: observacoes.trim() || null,
        valorTotal: valor.toString(),
        status: 'ORCAMENTO',
        dataEntrada: new Date(),
      });

      Alert.alert('Sucesso', 'Ordem de serviço criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error);
      Alert.alert('Erro', 'Não foi possível criar a ordem de serviço');
    } finally {
      setIsLoading(false);
    }
  };

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/\D/g, '');
    const valorFormatado = (parseInt(numero) / 100).toFixed(2);
    return valorFormatado.replace('.', ',');
  };

  const clienteSelecionado = clientesSelecionaveis.find(c => c.id === clienteId);
  const veiculoSelecionado = veiculosSelecionaveis.find(v => v.id === veiculoId);

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Nova Ordem de Serviço</Text>
          <Text style={styles.subtitle}>Preencha os dados abaixo</Text>
        </View>

        {/* Seleção de Cliente */}
        <View style={styles.section}>
          <Text style={styles.label}>Cliente *</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowClientesList(!showClientesList)}
          >
            <Text style={[styles.selectorText, !clienteSelecionado && styles.placeholderText]}>
              {clienteSelecionado ? clienteSelecionado.nomeRazaoSocial : 'Selecione um cliente'}
            </Text>
            <Ionicons
              name={showClientesList ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {showClientesList && (
            <View style={styles.optionsList}>
              {clientesSelecionaveis.map(cliente => (
                <TouchableOpacity
                  key={cliente.id}
                  style={[styles.optionItem, clienteId === cliente.id && styles.optionItemSelected]}
                  onPress={() => {
                    setClienteId(cliente.id);
                    setShowClientesList(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      clienteId === cliente.id && styles.optionTextSelected,
                    ]}
                  >
                    {cliente.nomeRazaoSocial}
                  </Text>
                  <Text style={styles.optionSubtext}>{cliente.email}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Seleção de Veículo */}
        <View style={styles.section}>
          <Text style={styles.label}>Veículo *</Text>
          <TouchableOpacity
            style={[styles.selector, !clienteId && styles.selectorDisabled]}
            onPress={() => clienteId && setShowVeiculosList(!showVeiculosList)}
            disabled={!clienteId}
          >
            <Text
              style={[
                styles.selectorText,
                (!veiculoSelecionado || !clienteId) && styles.placeholderText,
              ]}
            >
              {veiculoSelecionado
                ? `${veiculoSelecionado.placa} - ${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}`
                : !clienteId
                  ? 'Selecione um cliente primeiro'
                  : 'Selecione um veículo'}
            </Text>
            <Ionicons
              name={showVeiculosList ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={clienteId ? '#6B7280' : '#D1D5DB'}
            />
          </TouchableOpacity>

          {showVeiculosList && clienteId && (
            <View style={styles.optionsList}>
              {veiculosSelecionaveis.length > 0 ? (
                veiculosSelecionaveis.map(veiculo => (
                  <TouchableOpacity
                    key={veiculo.id}
                    style={[
                      styles.optionItem,
                      veiculoId === veiculo.id && styles.optionItemSelected,
                    ]}
                    onPress={() => {
                      setVeiculoId(veiculo.id);
                      setShowVeiculosList(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        veiculoId === veiculo.id && styles.optionTextSelected,
                      ]}
                    >
                      {veiculo.placa}
                    </Text>
                    <Text style={styles.optionSubtext}>
                      {veiculo.marca} {veiculo.modelo} ({veiculo.ano})
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>Nenhum veículo encontrado para este cliente</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição do Serviço *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Descreva os serviços a serem realizados..."
            placeholderTextColor="#9CA3AF"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Observações adicionais (opcional)..."
            placeholderTextColor="#9CA3AF"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Valor Total */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor Total (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor="#9CA3AF"
            value={valorTotal}
            onChangeText={text => setValorTotal(formatarMoeda(text))}
            keyboardType="numeric"
          />
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={criarOrdemServico}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Criar</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  optionsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionItemSelected: {
    backgroundColor: '#EBF4FF',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#3B82F6',
  },
  optionSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
