import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexts';

export default function HomeScreen() {
  const { user, token, logout } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const generateWorkoutPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/workout-plans/ai/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Erro ao gerar plano');
      const data = await response.json();
      const planId = data.id;
      await AsyncStorage.setItem('lastPlanId', planId);
      Alert.alert('🎉 Plano gerado com sucesso!', 'Confira em "Ver planos existentes".');
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Olá, {user?.name?.toLowerCase() || 'atleta'}{' '}
        <Text style={styles.wave}>👋</Text>
      </Text>
      <Text style={styles.subtitle}>Pronta pra começar seu treino inteligente?</Text>

      <View style={styles.menu}>
        <MenuButton icon="sparkles-outline" label="Gerar plano com IA" onPress={generateWorkoutPlan} />
        <MenuButton icon="list-outline" label="Ver planos existentes" onPress={() => navigation.navigate('WorkoutPlanList')} />
        <MenuButton icon="add-circle-outline" label="Nova sessão de treino" onPress={() => navigation.navigate('WorkoutSessionForm')} />
        <MenuButton icon="person-outline" label="Ver perfil" onPress={() => navigation.navigate('ViewProfile')} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 16 }} />}
    </View>
  );
}

function MenuButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={icon} size={18} color="#22C55E" />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    color: '#FAFAFA',
    fontWeight: '600',
    textAlign: 'center',
  },
  wave: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 40,
  },
  menu: {
    gap: 12,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#141414',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderColor: '#22C55E',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#22C55E22',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FAFAFA',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '500',
  },
});
