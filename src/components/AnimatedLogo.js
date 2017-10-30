// @flow
import React from 'react';
import {
  Animated,
  Easing,
} from 'react-native';
import logo from '../images/logo.png';

type Props = {
  onEnd?: Function,
  size?: number,
};

type State = {
  rotateValue: Animated.Value,
};

export default class AnimatedLogo extends React.Component<Props, State> {
  state = { rotateValue: new Animated.Value(0) };

  componentDidMount() {
    this.runAnimation();
  }

  onAnimationEnd() {
    if (this.props.onEnd) {
      this.props.onEnd();
    } else {
      this.runAnimation();
    }
  }

  runAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.timing(this.state.rotateValue, {
      toValue: 720,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
      duration: 2000,
    }).start(() => this.onAnimationEnd());
  }

  render() {
    const rotate = this.state.rotateValue.interpolate({
      inputRange: [0, 720],
      outputRange: ['0deg', '720deg'],
    });
    return (
      <Animated.Image
        source={logo}
        style={[
          {
            height: this.props.size,
            width: this.props.size,
          },
          { transform: [{ rotate }] },
        ]}
      />
    );
  }
}
