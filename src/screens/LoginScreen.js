import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContexts';
import { authStyles as styles } from '../styles/authStyles';

export default function LoginScreen({ navigation }) {
  const { setToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function hasCompleteProfile(user) {
    return (
      user.height &&
      user.weight &&
      user.birthDate &&
      user.gender &&
      user.goal &&
      user.level
    );
  }

  async function handleLogin() {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      if (!data.token) {
        throw new Error('Token JWT não recebido');
      }

      // Salva token no AuthContext e no AsyncStorage
      setToken(data.token);
      await AsyncStorage.setItem('token', data.token);

      // Busca o perfil do usuário autenticado
      const userRes = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (!userRes.ok) {
        throw new Error('Erro ao buscar perfil do usuário');
      }

      const userData = await userRes.json();
      setUser(userData);

      Alert.alert('Login realizado!');

      if (hasCompleteProfile(userData)) {
        navigation.replace('Home');
      } else {
        navigation.replace('CompleteProfile');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro de conexão');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>🏋️ AthletIA</Text>

        <View style={styles.inputGroup}>
          <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="log-in-outline" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Entrar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
