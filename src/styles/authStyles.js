import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inner: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#121212',
    padding: 32,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FAFAFA',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#2C2C2E',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#E5E5E5',
    fontSize: 16,
    caretColor: '#22C55E',
    transitionDuration: '0s', // evita fade branco
  },
  inputFocused: {
    borderColor: '#22C55E',
    borderWidth: 1.6,
    backgroundColor: '#1C1C1E',
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#22C55E',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    elevation: 4,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#0F0F0F',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  link: {
    marginTop: 28,
    color: '#A1A1AA',
    fontSize: 15,
    textDecorationLine: 'underline',
    textAlign: 'center',
    opacity: 0.9,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginBottom: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  errorBorder: {
    borderColor: '#ff6b6b',
    borderWidth: 1.6,
  },
});
