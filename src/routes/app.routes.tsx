import * as React from 'react';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        headerShown: false,
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 88,
        },        
      }}
    >
      <Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons 
              name='format-list-bulleted' 
              size={size} 
              color={color} 
            />
          ),
        }}        
      />

      <Screen 
        name="Register" 
        component={Register} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name='attach-money' 
              size={size} 
              color={color} 
            />
          ),
        }}
      />

      <Screen 
        name="Resume" 
        component={Resume} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name='pie-chart' 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Navigator>
  );
}