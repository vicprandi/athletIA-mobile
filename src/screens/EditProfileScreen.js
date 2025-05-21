import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
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
import { useAuth } from '../contexts/AuthContexts';

const genderOptions = ['MALE', 'FEMALE', 'OTHER'];
const goalOptions = ['HYPERTROPHY', 'WEIGHT_LOSS', 'RESISTANCE'];
const levelOptions = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function EditProfileScreen({ route }) {
  const { token } = useAuth();
  const navigation = useNavigation();
  const [form, setForm] = useState({
    birthDate: '',
    height: '',
    weight: '',
    gender: '',
    goal: '',
    level: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erro ao buscar perfil');
      const data = await res.json();
      setForm(data);
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Erro ao atualizar perfil');
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      if (route.params?.fromRegister) {
        navigation.replace('Login');
      } else {
        navigation.goBack();
      }

    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.avoider}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.background}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>✏️ Editar Perfil</Text>

        <LinearGradient
          colors={['#1C1C1E', '#121212']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <ProfileInput
            label="Data de nascimento"
            value={form.birthDate}
            onChangeText={(v) => handleChange('birthDate', v)}
            placeholder="aaaa-mm-dd"
          />
          <ProfileInput
            label="Altura (cm)"
            value={String(form.height)}
            onChangeText={(v) => handleChange('height', v)}
            keyboardType="numeric"
          />
          <ProfileInput
            label="Peso (kg)"
            value={String(form.weight)}
            onChangeText={(v) => handleChange('weight', v)}
            keyboardType="numeric"
          />

          <OptionSelector
            label="Gênero"
            options={genderOptions}
            selected={form.gender}
            onSelect={(v) => handleChange('gender', v)}
          />
          <OptionSelector
            label="Objetivo"
            options={goalOptions}
            selected={form.goal}
            onSelect={(v) => handleChange('goal', v)}
          />
          <OptionSelector
            label="Nível"
            options={levelOptions}
            selected={form.level}
            onSelect={(v) => handleChange('level', v)}
          />
        </LinearGradient>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-done-outline" size={18} color="#22C55E" />
          <Text style={styles.saveText}>Salvar alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ProfileInput({ label, value, onChangeText, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#666"
        {...props}
      />
    </View>
  );
}

function OptionSelector({ label, options, selected, onSelect }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.optionButton, selected === option && styles.optionSelected]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avoider: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  background: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  container: {
    padding: 24,
    paddingBottom: 64,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FAFAFA',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.6,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 32,
    backgroundColor: '#121212',
    shadowColor: '#22C55E',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 6,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1E1E20',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#FAFAFA',
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: '#2C2C2E',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
    columnGap: 8,
    marginTop: 6,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: '#3F3F46',
    backgroundColor: '#191919',
    minWidth: '30%',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#22C55E1A',
    borderColor: '#22C55E',
  },
  optionText: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#22C55E',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: '#101010',
    gap: 10,
    shadowColor: '#22C55E',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  saveText: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
