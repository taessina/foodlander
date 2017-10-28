// @flow
import React from 'react';
import {
  Animated,
  Easing,
  Platform,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Touchable from '../F8Touchable';
import colors from '../color';
import styles from './styles';

const buttonBackground = Platform.OS === 'android' && Platform.Version >= 21 ?
  TouchableNativeFeedback.Ripple(colors.rippleColor, true) : // eslint-disable-line new-cap
  null;

type Props = {
  onPress: func,
  children: element,
  position: string | number,
  buttonColor: string,
};

type State = {
  animValue: number,
  elevation: number,
};

class FloatingActionButton extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      animValue: new Animated.Value(0),
      elevation: 6,
    };
  }

  componentDidMount() {
    this.applyAnimation();
  }

  props: Props;

  applyAnimation() {
    Animated.timing(this.state.animValue, {
      toValue: 1,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      duration: 255,
    }).start();
  }

  elevate(elevation) {
    this.setState({ elevation });
  }

  render() {
    const animations = {
      transform: [
        { scale: this.state.animValue },
        {
          rotate: this.state.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['-90deg', '0deg'],
          }),
        },
      ],
      elevation: this.state.elevation,
    };

    return (
      <View style={[styles.container, styles[this.props.position]]}>
        <Animated.View
          style={[
            animations,
            styles.buttonContainer,
            { backgroundColor: this.props.buttonColor },
          ]}
        >
          <Touchable
            background={buttonBackground}
            onPress={() => this.props.onPress()}
            onPressIn={() => this.elevate(12)}
            onPressOut={() => this.elevate(6)}
          >
            <View style={styles.button}>
              {this.props.children}
            </View>
          </Touchable>
        </Animated.View>
      </View>
    );
  }
}

export default FloatingActionButton;
