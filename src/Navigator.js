import { StackNavigator } from 'react-navigation';
import Splashscreen from './components/Splashscreen';
import Home from './components/Home';

const Navigator = StackNavigator(
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
export default Navigator;
