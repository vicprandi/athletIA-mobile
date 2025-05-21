import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
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
  if (!email.trim() || !senha.trim()) {
    Alert.alert('Campos obrigatórios', 'Preencha o email e a senha.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Email ou senha inválidos.');
    }

    if (!data.token) {
      throw new Error('Token JWT não recebido');
    }

    setToken(data.token);
    await AsyncStorage.setItem('token', data.token);

    const userRes = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${data.token}` },
    });

    if (!userRes.ok) {
      throw new Error('Erro ao buscar perfil do usuário');
    }

    const userData = await userRes.json();
    setUser(userData);

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

        {/* INPUT EMAIL */}
        <View style={styles.inputGroup}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#aaa"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
            autoComplete="off"
            underlineColorAndroid="transparent"
            style={{
              flex: 1,
              height: 50,
              borderRadius: 10,
              paddingHorizontal: 12,
              backgroundColor: '#18181B',
              color: '#fff',
              fontSize: 16,
            }}
          />
        </View>

        {/* INPUT SENHA */}
        <View style={styles.inputGroup}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#aaa"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            autoCapitalize="none"
            textContentType="password"
            autoComplete="off"
            underlineColorAndroid="transparent"
            style={{
              flex: 1,
              height: 50,
              borderRadius: 10,
              paddingHorizontal: 12,
              backgroundColor: '#18181B',
              color: '#fff',
              fontSize: 16,
            }}
          />
        </View>

        {/* BOTÃO ENTRAR */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="log-in-outline"
              size={20}
              color="#000"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Entrar</Text>
          </View>
        </TouchableOpacity>

        {/* LINK CADASTRO */}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
