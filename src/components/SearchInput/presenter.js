// @flow
import React from 'react';
import {
  Platform,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/F8Touchable';
import colors from '../common/color';
import styles from './style';

type Props = {
  onBack: Function,
  onChangeText: Function,
  onPress: Function,
  suggestions: Array<String>,
  style: Object
};

const buttonBackground = Platform.OS === 'android' && Platform.Version >= 21 ?
  TouchableNativeFeedback.Ripple(colors.rippleColor, true) : // eslint-disable-line new-cap
  null;

class SearchInput extends React.Component<Props, void> {
  constructor(props) {
    super(props);
    this.handleChangeText = this.handleChangeText.bind(this);
  }

  handleChangeText(text) {
    this.props.onChangeText(text);
  }

  props: Props;

  renderSuggestions() {
    return this.props.suggestions.map((place, index) => {
      const { terms } = place;
      return (
        <View
          key={place.place_id}
          style={index === this.props.suggestions.length - 1 ? null : styles.border}
        >
          <Touchable
            background={buttonBackground}
            onPress={() => this.props.onPress(terms)}
          >
            <View style={styles.suggestion}>
              <Icon style={styles.placeIcon} name="place" size={24} color={colors.secondaryText} />
              <Text style={{ flex: 1 }} numberOfLines={1}>
                <Text style={styles.mainText}>{terms[0].value}</Text>
                {` ${terms.slice(1).map(t => t.value).join(', ')}`}
              </Text>
            </View>
          </Touchable>
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <View style={[styles.card, this.props.style]}>
          <Touchable
            background={buttonBackground}
            onPress={this.props.onBack}
          >
            <View>
              <Icon style={styles.icon} name="arrow-back" size={24} color={colors.primaryText} />
            </View>
          </Touchable>
          <TextInput
            autoFocus
            onChangeText={this.handleChangeText}
            placeholder="Search nearby"
            returnKeyType="search"
            style={styles.searchInput}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.suggestions}>{this.renderSuggestions()}</View>
      </View>
    );
  }
}

export default SearchInput;
