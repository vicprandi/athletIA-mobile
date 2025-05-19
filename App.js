import { registerRootComponent } from 'expo';
import AppRoutes from './src/routes/AppRoutes';

function App() {
  return <AppRoutes />;
}

export default registerRootComponent(App);
