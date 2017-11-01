import React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import colors from '../../themes/color';

const { height } = Dimensions.get('window');

class AnimatedBackgound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.runAnimation();
  }

  runAnimation() {
    this.state.animValue.setValue(0);
    Animated.timing(this.state.animValue, {
      toValue: 1,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      duration: 225,
    }).start();
  }

  render() {
    const scaleY = this.state.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    });
    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: scaleY,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.backgroundColor,
        }}
      />
    );
  }
}

export default AnimatedBackgound;
