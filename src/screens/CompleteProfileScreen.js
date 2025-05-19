import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authStyles as styles } from '../styles/authStyles';

const API_URL = 'http://192.168.5.157:8080';

export default function CompleteProfileScreen({ route, navigation }) {
  const { token } = route.params || {};

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('FEMALE');
  const [level, setLevel] = useState('BEGINNER');
  const [goal, setGoal] = useState('HYPERTROPHY');

  async function handleSubmit() {
    try {
      const payload = {
        height: parseFloat(height),
        weight: parseFloat(weight),
        birthDate,
        gender,
        level,
        goal,
      };

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (!response.ok) throw new Error(text || 'Erro ao atualizar perfil');

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      Alert.alert('Erro', error.message || 'Erro inesperado');
    }
  }

  const Option = ({ label, value, selected, setSelected }) => (
    <TouchableOpacity
      onPress={() => setSelected(value)}
      style={[ui.option, selected === value && ui.optionSelected]}
    >
      <Text style={[ui.optionText, selected === value && ui.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>🎯 Complete seu perfil</Text>

        {/* Altura */}
        <View style={styles.inputGroup}>
          <Ionicons name="accessibility-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Altura (ex: 1.70)"
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        {/* Peso */}
        <View style={styles.inputGroup}>
          <Ionicons name="barbell-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Peso (ex: 65.5)"
            placeholderTextColor="#aaa"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        {/* Data de nascimento */}
        <View style={styles.inputGroup}>
          <Ionicons name="calendar-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Data de nascimento (dd/mm/aaaa)"
            placeholderTextColor="#aaa"
            value={birthDate}
            onChangeText={setBirthDate}
          />
        </View>

        <Text style={ui.label}>Gênero</Text>
        <View style={ui.selectGroup}>
          <Option label="Feminino" value="FEMALE" selected={gender} setSelected={setGender} />
          <Option label="Masculino" value="MALE" selected={gender} setSelected={setGender} />
          <Option label="Outro" value="OTHER" selected={gender} setSelected={setGender} />
        </View>

        <Text style={ui.label}>Nível de treino</Text>
        <View style={ui.selectGroup}>
          <Option label="Iniciante" value="BEGINNER" selected={level} setSelected={setLevel} />
          <Option label="Intermediário" value="INTERMEDIATE" selected={level} setSelected={setLevel} />
          <Option label="Avançado" value="ADVANCED" selected={level} setSelected={setLevel} />
        </View>

        <Text style={ui.label}>Objetivo</Text>
        <View style={ui.selectGroup}>
          <Option label="Hipertrofia" value="HYPERTROPHY" selected={goal} setSelected={setGoal} />
          <Option label="Emagrecimento" value="FAT_LOSS" selected={goal} setSelected={setGoal} />
          <Option label="Resistência" value="ENDURANCE" selected={goal} setSelected={setGoal} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar perfil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const ui = StyleSheet.create({
  label: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  selectGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
    marginBottom: 12,
  },
  option: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    paddingVertical: 10,
    paddingHorizontal: 8, // menor padding lateral
    borderRadius: 12,
    borderColor: '#2C2C2E',
    borderWidth: 1.4,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#22C55E1A',
    borderColor: '#22C55E',
  },
  optionText: {
    color: '#E5E5E5',
    fontSize: 13,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#22C55E',
    fontWeight: 'bold',
  },
});
