/* navigationState from redux-store, renderScene function that render the the current screen on the phone */
/* initial screen === splash-screen, Home Screen */
import React from 'react-native';
import { StackNavigator } from 'react-navigation';
import Splashscreen from '../components/Splashscreen/presenter';
import Home from '../components/Home';

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
