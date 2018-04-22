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
import { actionCreators as placeActionCreators } from '../../redux/modules/place';

type State = {
  listIndex: number,
}

type Props = {
 doSetFavMode: Function,
 doSetFavChoosed: Function,
 doSetFav: Function,
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

  handleBackButton() {
    if (this.props.visibility) {
      this.props.doSetFav(false);
    }

    return false;
  }

  renderItems(count: number) {
    return (
      <TouchableHighlight key={count} onPress={() => this.onItemSelected(count)}>
        <View
          style={{
            width: '100%',
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: count % 2 === 0 ? 'rgba(53,119,255,0.8)' : 'rgba(73,139,255,0.8)',
                }}
        >
          <Text style={{
            color: '#FFFFFF', fontSize: 30, fontWeight: 'bold',
          }}
          >{this.props.favouriteList[count].title}
          </Text>
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
