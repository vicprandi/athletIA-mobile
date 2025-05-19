import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authStyles as styles } from '../styles/authStyles';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  async function handleRegister() {
    setEmailError('');
    setUsernameError('');

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome,
          username: username,
          email: email,
          password: senha,
        }),
      });

      const text = await response.text();
      console.log('Resposta do backend:', text);

      let json;
      try {
        json = JSON.parse(text);
      } catch (err) {
        console.error('Erro ao fazer parse do JSON:', err);
        Alert.alert('Erro', 'Erro inesperado no servidor. Tente novamente.');
        return;
      }

      if (!response.ok) {
        switch (json.error) {
          case 'EMAIL_ALREADY_EXISTS':
            setEmailError('Este e-mail já está cadastrado.');
            break;
          case 'USERNAME_ALREADY_EXISTS':
            setUsernameError('Este nome de usuário já está em uso.');
            break;
          case 'INVALID_PASSWORD':
            Alert.alert('Erro', 'A senha deve conter letras maiúsculas, minúsculas e caracteres especiais.');
            break;
          default:
            Alert.alert('Erro', json.message || 'Erro ao registrar. Tente novamente.');
        }
        return;
      }

      Alert.alert('Conta criada!', 'Agora é só fazer login.');
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    }
  }

  const getInputStyle = (fieldName) => [
    styles.input,
    focusedField === fieldName && styles.inputFocused,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Crie sua conta</Text>

        <View style={styles.inputGroup}>
          <Ionicons name="person-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#aaa"
            value={nome}
            onChangeText={setNome}
            style={getInputStyle('nome')}
            onFocus={() => setFocusedField('nome')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        <View style={StyleSheet.compose(styles.inputGroup, usernameError ? styles.errorBorder : null)}>
          <Ionicons name="at-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
            autoCapitalize="none"
            style={getInputStyle('username')}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={StyleSheet.compose(styles.inputGroup, emailError ? styles.errorBorder : null)}>
          <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={getInputStyle('email')}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            style={getInputStyle('senha')}
            onFocus={() => setFocusedField('senha')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Ionicons name="person-add-outline" size={20} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem conta? Faça o login!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
