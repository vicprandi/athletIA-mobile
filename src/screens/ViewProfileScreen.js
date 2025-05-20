import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexts';

export default function ViewProfileScreen() {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {    
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar perfil');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Perfil não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.screenBackground}
    >
      <Text style={styles.title}>👤 Aqui está o seu perfil!</Text>

      <LinearGradient
        colors={['#1C1C1E', '#131313']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <ProfileField label="Nome" value={profile.name} />
        <ProfileField label="Username" value={profile.username} />
        <ProfileField label="Email" value={profile.email} />
        <ProfileField label="Nascimento" value={profile.birthDate} />
        <ProfileField label="Altura" value={`${profile.height} cm`} />
        <ProfileField label="Peso" value={`${profile.weight} kg`} />
        <ProfileField label="Gênero" value={profile.gender} />
        <ProfileField label="Objetivo" value={profile.goal} />
        <ProfileField label="Nível" value={profile.level} />
      </LinearGradient>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Ionicons name="create-outline" size={18} color="#22C55E" />
        <Text style={styles.editText}>Editar informações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="arrow-back-outline" size={18} color="#A1A1AA" />
        <Text style={styles.backText}>Voltar para início</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ProfileField({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenBackground: {
    backgroundColor: '#0D0D0D',
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 60,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FAFAFA',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
    shadowColor: '#22C55E44',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    paddingVertical: 12,
    borderBottomColor: '#2D2D2D',
    borderBottomWidth: 1,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: '500',
  },
  editBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#22C55E',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 8,
    backgroundColor: '#141414',
  },
  editText: {
    color: '#22C55E',
    fontSize: 15,
    fontWeight: '500',
  },
  backBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3F3F46',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#121212',
    gap: 8,
  },
  backText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
  },
});
