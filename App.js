import React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

import AnaSayfa from './AnaSayfa';
import RaporSayfasi from './RaporSayfasi';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Ana Sayfa') {
              iconName = 'stopwatch'; 
            } else if (route.name === 'Rapor Sayfası') {
              iconName = 'chart-bar'; 
            }
            
            return <FontAwesome5 name={iconName} color={color} size={size}/>;
          },
          tabBarActiveTintColor: 'black', 
          tabBarInactiveTintColor: 'gray',
        })}
      >

        <Tab.Screen
          name="Ana Sayfa"
          component={AnaSayfa}
        />
        <Tab.Screen
          name="Rapor Sayfası"
          component={RaporSayfasi}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


