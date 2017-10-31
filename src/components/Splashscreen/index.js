// @flow
import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import AnimatedLogo from '../common/AnimatedLogo';
import styles from './style';

type Props = {
  navigation: Object,
};

type State = {
  title: String,
};

export default class Splashscreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Splash',
  }

  constructor(props) {
    super(props);

    this.goToNext = this.goToNext.bind(this);
  }

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
        <AnimatedLogo size={320} onEnd={this.goToNext} />
        <Text style={styles.loadingText}>
            humbly solving the ultimate question in life
        </Text>
      </View>
    );
  }
}
