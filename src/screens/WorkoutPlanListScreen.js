import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexts';

export default function WorkoutPlansListScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_URL}/workout-plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao buscar planos');
      const data = await response.json();
      setPlans(data.reverse());
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      const response = await fetch(`${API_URL}/workout-plans/${planId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao deletar plano');
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const renderItem = ({ item, index }) => {
    const date = new Date(item.createdAt).toLocaleDateString('pt-BR');

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutPlan', { planId: item.id })}
          style={{ flex: 1 }}
        >
          <Text style={styles.title}>Plano #{plans.length - index}: {item.title}</Text>
          <Text style={styles.subtitle}>🎯 {item.goal} • ⏳ {item.durationWeeks} semanas</Text>
          <Text style={styles.date}>📅 Criado em: {date}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePlan(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#f87171" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📚 Meus Planos de Treino</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#22C55E" />
      ) : plans.length === 0 ? (
        <Text style={styles.empty}>Você ainda não tem nenhum plano.</Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32, gap: 12 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backIcon: {
    color: '#22C55E',
    fontSize: 18,
    marginRight: 4,
  },
  backText: {
    color: '#22C55E',
    fontSize: 15,
    fontWeight: '500',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FAFAFA',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22C55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1AA',
  },
  date: {
    fontSize: 13,
    color: '#52525B',
    marginTop: 6,
  },
  empty: {
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 48,
  },
});
