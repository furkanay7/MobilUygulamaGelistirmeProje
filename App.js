import React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnaSayfa from './AnaSayfa';
import RaporSayfasi from './RaporSayfasi';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Ana Sayfa"
          component={AnaSayfa}
        />
        <Stack.Screen
          name="Rapor Sayfası"
          component={RaporSayfasi}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


