import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
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

export default function WorkoutPlanScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { planId } = route.params;
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchExercises() {
    try {
      const res = await fetch(`${API_URL}/workout-plans/${planId}/exercises/full`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erro ao buscar exercícios');
      const data = await res.json();
      setExercises(data);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExercises();
  }, [planId]);

  const handleDelete = async (exerciseId) => {
    try {
      const response = await fetch(`${API_URL}/workout-plans/${planId}/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao deletar exercício');
      setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>
            <Ionicons name="barbell-outline" size={18} /> {item.exercise.name}
          </Text>
          <Text style={styles.muscleGroup}>{item.exercise.muscleGroup}</Text>
          <Text style={styles.details}>
            {item.sets}x{item.reps} • {item.restSeconds}s descanso
          </Text>
            {typeof item.suggestedLoad === 'number' && item.suggestedLoad > 0 && (
          <Text style={styles.load}>Carga sugerida: {item.suggestedLoad} kg</Text>
        )}
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#f87171" />
        </TouchableOpacity>
      </View>

      {item.exercise.description && (
        <Text style={styles.description}>{item.exercise.description}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#22C55E" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📋 Seu plano de treino</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#22C55E" />
      ) : exercises.length === 0 ? (
        <Text style={styles.empty}>Nenhum exercício no plano.</Text>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: '#22C55E',
    fontSize: 15,
    marginLeft: 4,
    fontWeight: '500',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FAFAFA',
  },
  muscleGroup: {
    fontSize: 14,
    color: '#22C55E',
    fontStyle: 'italic',
    marginTop: 2,
  },
  details: {
    fontSize: 13,
    color: '#A1A1AA',
    marginTop: 6,
  },
  load: {
    fontSize: 13,
    color: '#FACC15',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#E4E4E7',
    marginTop: 6,
    fontStyle: 'italic',
  },
  empty: {
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 32,
  },
});
