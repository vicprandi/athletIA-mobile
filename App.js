import { registerRootComponent } from 'expo';
import { AuthProvider } from './src/contexts/AuthContexts';
import AppRoutes from './src/routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default registerRootComponent(App);
