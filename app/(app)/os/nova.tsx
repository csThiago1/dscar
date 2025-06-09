import { useOSStore } from '@/stores/os';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NovaOSScreen() {
  const router = useRouter();
  const { createOrdem } = useOSStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clienteId: '',
    veiculoId: '',
    quilometragem: '',
    descricaoServico: '',
    observacoes: '',
    valorPecas: '',
    valorServicos: '',
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!formData.clienteId || !formData.veiculoId || !formData.descricaoServico) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
        return;
      }

      await createOrdem({
        clienteId: parseInt(formData.clienteId),
        veiculoId: parseInt(formData.veiculoId),
        quilometragem: parseInt(formData.quilometragem),
        descricaoServico: formData.descricaoServico,
        observacoes: formData.observacoes || null,
        valorPecas: formData.valorPecas || null,
        valorServicos: formData.valorServicos || null,
        status: 'ORCAMENTO',
      });

      Alert.alert('Sucesso', 'Ordem de serviço criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a ordem de serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>ID do Cliente *</Text>
        <TextInput
          style={styles.input}
          value={formData.clienteId}
          onChangeText={text => setFormData({ ...formData, clienteId: text })}
          keyboardType="numeric"
          placeholder="Digite o ID do cliente"
        />

        <Text style={styles.label}>ID do Veículo *</Text>
        <TextInput
          style={styles.input}
          value={formData.veiculoId}
          onChangeText={text => setFormData({ ...formData, veiculoId: text })}
          keyboardType="numeric"
          placeholder="Digite o ID do veículo"
        />

        <Text style={styles.label}>Quilometragem *</Text>
        <TextInput
          style={styles.input}
          value={formData.quilometragem}
          onChangeText={text => setFormData({ ...formData, quilometragem: text })}
          keyboardType="numeric"
          placeholder="Digite a quilometragem atual"
        />

        <Text style={styles.label}>Descrição do Serviço *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.descricaoServico}
          onChangeText={text => setFormData({ ...formData, descricaoServico: text })}
          multiline
          numberOfLines={4}
          placeholder="Descreva o serviço a ser realizado"
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.observacoes}
          onChangeText={text => setFormData({ ...formData, observacoes: text })}
          multiline
          numberOfLines={4}
          placeholder="Adicione observações relevantes"
        />

        <Text style={styles.label}>Valor das Peças</Text>
        <TextInput
          style={styles.input}
          value={formData.valorPecas}
          onChangeText={text => setFormData({ ...formData, valorPecas: text })}
          keyboardType="decimal-pad"
          placeholder="Digite o valor das peças"
        />

        <Text style={styles.label}>Valor dos Serviços</Text>
        <TextInput
          style={styles.input}
          value={formData.valorServicos}
          onChangeText={text => setFormData({ ...formData, valorServicos: text })}
          keyboardType="decimal-pad"
          placeholder="Digite o valor dos serviços"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar Ordem de Serviço'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#f4511e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
