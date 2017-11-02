// @flow
import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AnimatedLogo from '../../components/AnimatedLogo';
import styles from './style';

type Props = {
  navigation: Object,
};

export function Splash() {
  return (
    <View style={styles.loadingContainer}>
      <AnimatedLogo size={320} />
      <Text style={styles.loadingText}>
        humbly solving the ultimate question in life
      </Text>
    </View>
  );
}

export default class Splashscreen extends React.Component<Props> {
  goToNext() {
    if (this.props.navigation != null) {
      const resetNavigation = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Home' })],
      });

      const { dispatch } = this.props.navigation;
      dispatch(resetNavigation);
    }
  }
  render() {
    return (
      <View style={styles.loadingContainer}>
        <AnimatedLogo size={320} onEnd={() => this.goToNext()} />
        <Text style={styles.loadingText}>
        humbly solving the ultimate question in life
        </Text>
      </View>
    );
  }
}
