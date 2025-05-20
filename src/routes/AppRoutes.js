import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContexts';

// Importa suas telas
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ViewProfileScreen from '../screens/ViewProfileScreen';
import WorkoutPlanListScreen from '../screens/WorkoutPlanListScreen';
import WorkoutPlanScreen from '../screens/WorkoutPlanScreen';
import WorkoutSessionFormScreen from '../screens/WorkoutSessionFormScreen';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
            <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
            <Stack.Screen name="WorkoutSessionForm" component={WorkoutSessionFormScreen} />
            <Stack.Screen name="WorkoutPlanList" component={WorkoutPlanListScreen} />
            <Stack.Screen name="EditProfile" component={CompleteProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
