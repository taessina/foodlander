// @flow
import React from 'react';
import {
  View,
  ScrollView,
  Modal,
  Text,
  TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import styles from './style';
import colors from '../../themes/color';
import { actionCreators as placeActionCreators } from '../../redux/modules/place';

type State = {
  listIndex: number,
}

type Props = {
 doSetFavMode: Function,
 doSetFavChoosed: Function,
 doSetFav: Function,
 favMode: boolean,
 visibility: boolean,
 favouriteList: Object[],
 favChoosed: string,
}

class FavList extends React.Component<Props, State> {
  static props = {
    visibility: false,
    place: null,
    favChoosed: '',
  };

  // one of the list title selected
  onItemSelected(count) {
    if (this.props.favChoosed !== this.props.favouriteList[count].title) {
      this.props.doSetFavChoosed(this.props.favouriteList[count].title);
    }
    this.props.doSetFavMode(true);
    this.props.doSetFav(false);
  }

  modeSwitch() {
    this.hideMenu();
    if (this.props.favMode) {
      this.props.doSetFavMode(false);
    }
    this.props.doSetFavChoosed('');
  }

  hideMenu() {
    if (this.props.visibility) {
      this.props.doSetFav(false);
    }
  }

  handleBackButton() {
    this.hideMenu();
    return false;
  }

  renderItems(count: number) {
    const { title } = this.props.favouriteList[count];
    return (
      <TouchableHighlight key={count} onPress={() => this.onItemSelected(count)}>
        <View
          style={[styles.itemBox, { backgroundColor: title === this.props.favChoosed ? '#D6EBFF' : '#FFFFFF' }]}
        >
          <View style={styles.titleBox}>
            <Text style={styles.itemText}> {title} </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.itemText}> {this.props.favouriteList[count].items.length} </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderFavItems() {
    const items = [];
    for (let i = 0; i < this.props.favouriteList.length; i += 1) {
      items.push(this.renderItems(i));
    }
    return items;
  }

  renderHeader() {
    return (
      <View
        style={[
          styles.headerBox,
          { backgroundColor: this.props.favMode ? colors.subAccentColor2 : colors.subAccentColor },
          ]}
      >
        <Text style={[
          styles.headerText,
          { color: this.props.favMode ? '#808080' : '#FFFFFF' },
          ]}
        >
        Choose from favourite list
        </Text>
        <View style={styles.buttonBox} />
        {this.props.favMode ? this.renderBackButton() : null}
      </View>
    );
  }

  renderBackButton() {
    return (
      <TouchableHighlight
        onPress={() => this.modeSwitch()}
        style={styles.backButtonStyle}
      >
        <Text style={styles.buttonTextStyle}>BACK</Text>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.visibility}
        transparent
        onRequestClose={() => { this.handleBackButton(); }}
      >
        <View style={styles.favContainer}>
          <View style={styles.favMainBox}>
            <ScrollView style={{ width: '100%' }}>
              {this.renderHeader()}
              {this.renderFavItems()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    visibility: state.place.fav,
    favMode: state.place.favMode,
    favChoosed: state.place.favChoosed,
    favouriteList: state.favourite.favouriteList,
  };
}

const mapDispatchToProps = {
  doSetFav: placeActionCreators.doSetFav,
  doSetFavMode: placeActionCreators.doSetFavMode,
  doSetFavChoosed: placeActionCreators.doSetFavChoosed,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavList);
