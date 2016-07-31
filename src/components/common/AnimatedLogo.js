import React from 'react';
import {
  Animated,
  Easing,
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
    justifyContent: 'space-around',
  },
  loadingLogo: {
    height: 320,
    width: 320,
  },
  loadingText: {
    color: colors.loadingTextColor,
    fontWeight: '500',
    textAlign: 'center',
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
    Animated.timing(this.state.rotateValue, {
      toValue: 720,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
      duration: 2000,
    }).start(() => this.runAnimation());
  }

  render() {
    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 720],
      outputRange: ['0deg', '720deg'],
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
        <Text style={styles.loadingText}>
          humbly solving the ultimate question in life
        </Text>
      </View>
    );
  }
}

export default AnimatedLogo;
