import React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AnaSayfa from './AnaSayfa';
import RaporSayfasi from './RaporSayfasi';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
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


