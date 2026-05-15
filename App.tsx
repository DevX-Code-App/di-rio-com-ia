import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from './src/screens/HomeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { InsightsScreen } from './src/screens/InsightsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'book' : 'book-outline';
              } else if (route.name === 'Insights') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              } else {
                iconName = 'help-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#95A5A6',
            tabBarStyle: {
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: '#E9ECEF',
              backgroundColor: '#FFF',
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ tabBarLabel: 'Escrever' }}
          />
          <Tab.Screen 
            name="History" 
            component={HistoryScreen}
            options={{ tabBarLabel: 'Histórico' }}
          />
          <Tab.Screen 
            name="Insights" 
            component={InsightsScreen}
            options={{ tabBarLabel: 'Insights' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ tabBarLabel: 'Configurações' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
