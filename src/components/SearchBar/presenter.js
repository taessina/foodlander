// @flow
import React from 'react';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/F8Touchable';
import colors from '../common/color';
import styles from './style';

type Props = {
  onPress: Function,
  area: String,
  keyword: String
};

type State = {
  elevation: number
};

const buttonBackground = Platform.OS === 'android' && Platform.Version >= 21 ?
  TouchableNativeFeedback.Ripple(colors.rippleColor, true) : // eslint-disable-line new-cap
  null;

class SearchBar extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { elevation: 2 };
  }

  props: Props;

  elevate(elevation) {
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

export default SearchBar;
