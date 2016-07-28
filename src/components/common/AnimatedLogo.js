import React from 'react';
import {
  Animated,
  Text,
  View,
} from 'react-native';
import logo from '../../images/logo.png';

import createStyleSheet from '../common/createStyleSheet';
import colors from '../common/color';

const styles = createStyleSheet({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  loadingLogo: {
    height: 160,
    width: 160,
  },
  loadingText: {
    color: colors.accentColor,
    fontWeight: '500',
    marginTop: 16,
  },
});

class AnimatedLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.runAnimation();
  }

  runAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.decay(this.state.rotateValue, {
      fromValue: 0,
      toValue: 360,
      velocity: 2,
    }).start(() => this.runAnimation());
  }

  render() {
    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={logo}
          style={[
            styles.loadingLogo,
            { transform: [{ rotate }] },
          ]}
        />
        <Text style={styles.loadingText}>Searching for nearby restaurants</Text>
      </View>
    );
  }
}

export default AnimatedLogo;
