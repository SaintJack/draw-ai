import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawingScreen from '../screens/DrawingScreen';
import GalleryScreen from '../screens/GalleryScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Drawing: {drawingId?: string} | undefined;
  Gallery: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Drawing"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Drawing"
        component={DrawingScreen}
        options={{title: '画布'}}
      />
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{title: '作品集'}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: '设置'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
