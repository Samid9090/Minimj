import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import ModeSelectionScreen from './screens/ModeSelectionScreen';
import ParentModeScreen from './screens/ParentModeScreen';
import KidsModeScreen from './screens/KidsModeScreen';
import ConnectionScreen from './screens/ConnectionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="ModeSelection"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="ModeSelection" 
            component={ModeSelectionScreen}
            options={{ title: 'Parental Control App' }}
          />
          <Stack.Screen 
            name="ParentMode" 
            component={ParentModeScreen}
            options={{ title: 'Parent Mode' }}
          />
          <Stack.Screen 
            name="KidsMode" 
            component={KidsModeScreen}
            options={{ title: 'Kids Mode' }}
          />
          <Stack.Screen 
            name="Connection" 
            component={ConnectionScreen}
            options={{ title: 'Connected' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

