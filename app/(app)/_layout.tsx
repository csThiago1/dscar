import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';

export default function AppLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#007bff',
        drawerInactiveTintColor: '#8e8e93',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="menu"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="os"
        options={{
          drawerLabel: 'Ordens de Serviço',
          title: 'Ordens de Serviço',
          drawerIcon: ({ size, color }: { size: number; color: string }) => (
            <Ionicons name="build-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Adicione outras telas do menu aqui (Clientes, Veículos, etc.) */}
    </Drawer>
  );
}
