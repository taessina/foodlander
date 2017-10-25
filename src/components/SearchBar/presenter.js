import React from 'react';
import propTypes from 'prop-types';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/F8Touchable';
import colors from '../common/color.js';
import styles from './style.js';

const buttonBackground = Platform.OS === 'android' && Platform.Version >= 21 ?
  TouchableNativeFeedback.Ripple(colors.rippleColor, true) : // eslint-disable-line new-cap
  null;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elevation: 2 };
  }

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

SearchBar.propTypes = {
  onPress: propTypes.func.isRequired,
  area: propTypes.string.isRequired,
  keyword: propTypes.string.isRequired,
};

export default SearchBar;
