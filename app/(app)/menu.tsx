import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, Title } from 'react-native-paper';

export default function DashboardScreen() {
  // Mock data - substitua com dados reais do seu store
  const osAbertas = 5;
  const agendamentosHoje = 3;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Dashboard</Title>

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineLarge">{osAbertas}</Text>
            <Text variant="titleMedium">OS Abertas</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineLarge">{agendamentosHoje}</Text>
            <Text variant="titleMedium">Agendamentos Hoje</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actionsContainer}>
        <Link href="/os/nova" asChild>
          <Button icon="plus" mode="contained" style={styles.button}>
            Nova Ordem de Serviço
          </Button>
        </Link>
        <Link href="/os" asChild>
          <Button icon="format-list-bulleted" mode="outlined" style={styles.button}>
            Ver todas as OS
          </Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  card: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  actionsContainer: {
    marginTop: 16,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },
});
