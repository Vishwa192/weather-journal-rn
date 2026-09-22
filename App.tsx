import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import HomeScreen from '@/screens/HomeScreen';
import AddEntryScreen from '@/screens/AddEntryScreen';
import DetailScreen from '@/screens/DetailScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { useEffect, useState } from 'react';
import { initDatabase } from '@/db/databases';

export type HomeStackParamList = {
  Home: undefined;
  AddEntry: undefined;
  Detail: { entryId: number };
}
const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'New Entry' }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Entry Details' }} />

    </Stack.Navigator>
  )
}

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setDbReady(true))
  }, [])

  if (!dbReady) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home', headerShown: false }} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}