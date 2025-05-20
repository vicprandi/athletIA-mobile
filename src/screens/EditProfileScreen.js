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

export default function EditProfileScreen() {
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
      navigation.goBack();
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
    backgroundColor: '#0D0D0D',
  },
  background: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    padding: 24,
    paddingBottom: 64,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FAFAFA',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 32,
    shadowColor: '#22C55E44',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: '#A1A1AA',
    fontSize: 13,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#18181B',
    borderRadius: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: 14,
    color: '#FAFAFA',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3F3F46',
    backgroundColor: '#1A1A1A',
  },
  optionSelected: {
    backgroundColor: '#22C55E33',
    borderColor: '#22C55E',
  },
  optionText: {
    color: '#FAFAFA',
    fontWeight: '500',
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#22C55E',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#141414',
    gap: 8,
  },
  saveText: {
    color: '#22C55E',
    fontSize: 15,
    fontWeight: '500',
  },
});
