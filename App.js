import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReaderTab from './ReaderTab';
import FlashcardsTab from './FlashcardsTab';
import { Provider as PaperProvider } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function App(){
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator initialRouteName="Reader">
          <Tab.Screen name="Reader" component={ReaderTab} />
          <Tab.Screen name="Signals" component={FlashcardsTab} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
