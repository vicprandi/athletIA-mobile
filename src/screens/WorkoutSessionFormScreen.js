import { StyleSheet, Text, View } from 'react-native';

export default function WorkoutSessionFormScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Formulário de sessão de treino</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});
