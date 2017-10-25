import React from 'react-native';
import { StackNavigator } from 'react-navigation';
import Splashscreen from './components/Splashscreen/presenter';
import Home from './components/Home';

const ReactNavigator = StackNavigator(
  {
    Splash: {
      screen: Splashscreen,
    },
    Home: {
      screen: Home,
    },
  },
  {
    headerMode: 'none',
  },
);
export default ReactNavigator;
