import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Menu() {
  const { signOut } = useAuth();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Ordens de Serviço',
      icon: 'document-text',
      route: '/(app)/ordens-servico',
    },
    {
      title: 'Clientes',
      icon: 'people',
      route: '/(app)/clientes',
    },
    {
      title: 'Veículos',
      icon: 'car',
      route: '/(app)/veiculos',
    },
    {
      title: 'Agendamentos',
      icon: 'calendar',
      route: '/(app)/agendamentos',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DSCar</Text>
        <Text style={styles.subtitle}>Sistema de Gestão</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Link key={index} href={item.route} asChild>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name={item.icon as any} size={24} color="#2563eb" />
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Ionicons name="log-out" size={24} color="#ef4444" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    marginBottom: 32,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    marginLeft: 12,
  },
});
