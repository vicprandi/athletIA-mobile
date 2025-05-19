import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
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
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#f87171" />
        </TouchableOpacity>
      </View>

      <Text style={styles.details}>
        {item.sets}x{item.reps} • {item.restSeconds}s descanso
      </Text>

      {item.suggestedLoad ? (
        <Text style={styles.load}>Carga sugerida: {item.suggestedLoad} kg</Text>
      ) : null}

      {item.exercise.description && (
        <Text style={styles.description}>{item.exercise.description}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
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
    alignItems: 'center',
    marginBottom: 8,
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
    fontSize: 14,
    color: '#A1A1AA',
    marginTop: 4,
  },
  load: {
    fontSize: 13,
    color: '#FACC15',
    marginTop: 4,
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
