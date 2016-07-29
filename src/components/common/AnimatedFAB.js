import React, { PropTypes } from 'react';
import {
  Animated,
  Easing,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Touchable from '../common/F8Touchable';
import createStyleSheet from '../common/createStyleSheet';
import colors from '../common/color';
import logo from '../../images/logo.png';

const buttonBackground =
  TouchableNativeFeedback.Ripple(colors.rippleColor, true); // eslint-disable-line new-cap

const styles = createStyleSheet({
  buttonContainer: {
    borderRadius: 28,
    backgroundColor: '#fafafa',
    elevation: 6,
  },
});

class AnimatedFAB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      elevation: 6,
    };
  }

  componentDidMount() {
    this.runAnimation();
  }

  runAnimation() {
    Animated.timing(this.state.animValue, {
      toValue: 56,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      duration: 255,
    }).start();
  }

  elevate(elevation) {
    this.setState({ elevation });
  }

  render() {
    const { animValue } = this.state;
    const rotate = animValue.interpolate({
      inputRange: [0, 56],
      outputRange: ['-90deg', '0deg'],
    });

    return (
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            height: animValue,
            width: animValue,
            transform: [{ rotate }],
            elevation: this.state.elevation,
          },
        ]}
      >
        <Touchable
          background={buttonBackground}
          onPress={() => this.props.onPress()}
          onPressIn={() => this.elevate(12)}
          onPressOut={() => this.elevate(6)}
        >
          <View>
            <Animated.Image
              style={{ height: animValue, width: animValue }}
              source={logo}
            />
          </View>
        </Touchable>
      </Animated.View>
    );
  }
}

AnimatedFAB.propTypes = {
  onPress: PropTypes.func,
};

export default AnimatedFAB;
