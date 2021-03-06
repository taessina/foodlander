// @flow
import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Touchable from '../F8Touchable';
import colors from '../../themes/color';
import styles from './styles';

const buttonBackground = Platform.OS === 'android' && Platform.Version >= 21 ?
  TouchableNativeFeedback.Ripple(colors.rippleColor, true) : // eslint-disable-line new-cap
  null;

type Props = {
  onPress: Function,
  children: React.Node,
  position: 'center' | 'left' | 'right' | 'bottomRight' | 'topRight',
  buttonColor: string,
  pushed: boolean,
  orientation: 'default' | 'up' | 'down' | 'left' | 'right',
  disabled: boolean,
};

type State = { animValue: Animated.Value, elevation: number };

export default class FloatingActionButton extends React.Component<Props, State> {
  static defaultProps = {
    position: 'center',
    buttonColor: 'white',
    orientation: 'default',
    disabled: false,
  };

  state = {
    animValue: new Animated.Value(0),
    elevation: 6,
  };

  componentDidMount() {
    this.applyAnimation();
  }

  applyAnimation() {
    Animated.timing(this.state.animValue, {
      toValue: 1,
      easing: Easing.bezier(0.0, 0.0, 0.2, 1),
      duration: 255,
    }).start();
  }

  elevate(elevation: number) {
    this.setState({ elevation });
  }

  retrieveStyle(): Object {
    switch (this.props.orientation) {
      case 'up':
        return styles.upPillContainer;
      case 'down':
        return styles.downPillContainer;
      case 'left':
        return styles.leftPillContainer;
      case 'right':
        return styles.rightPillContainer;
      default:
        return styles.buttonContainer;
    }
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
      <View style={[
        this.props.pushed ? styles.pushed : styles.default,
        styles[this.props.position]]}
      >
        <Animated.View
          style={[
            animations,
            this.retrieveStyle(),
            this.props.disabled ? { borderColor: colors.disabledColor } : null,
            { backgroundColor: this.props.buttonColor },
          ]}
        >
          <Touchable
            background={buttonBackground}
            onPress={() => this.props.onPress()}
            onPressIn={() => this.elevate(12)}
            onPressOut={() => this.elevate(6)}
          >
            <View style={this.props.orientation === 'default' ? styles.button : styles.pillButton}>
              {this.props.children}
            </View>
          </Touchable>
        </Animated.View>
      </View>
    );
  }
}
