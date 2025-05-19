import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WorkoutPlanScreen from '../screens/WorkoutPlanScreen';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
