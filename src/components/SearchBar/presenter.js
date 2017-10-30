// @flow
import React from 'react';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../F8Touchable';
import colors from '../../themes/color';
import styles from './style';

const buttonBackground = Platform.OS === 'android' && Platform.Version >= 21 ?
  TouchableNativeFeedback.Ripple(colors.rippleColor, true) : // eslint-disable-line new-cap
  null;

type Props = {
  onPress: Function,
  area: string,
  keyword: string,
};

type State = { elevation: number };

export default class SearchBar extends React.Component<Props, State> {
  state = { elevation: 2 };

  elevate(elevation: number) {
    this.setState({ elevation });
  }

  render() {
    return (
      <View style={[styles.card, { elevation: this.state.elevation }]}>
        <Touchable
          background={buttonBackground}
          onPress={this.props.onPress}
          onPressIn={() => this.elevate(8)}
          onPressOut={() => this.elevate(2)}
        >
          <View style={styles.buttonContainer}>
            <Icon style={styles.icon} name="search" size={24} color={colors.primaryText} />
            <Text style={styles.areaText}>{this.props.keyword || this.props.area || 'Search'}</Text>
          </View>
        </Touchable>
      </View>
    );
  }
}
