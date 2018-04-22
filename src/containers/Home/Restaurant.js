// @flow
import React from 'react';
import {
  View,
  Modal,
  Image,
  ToastAndroid,
} from 'react-native';
import Config from 'react-native-config';
import querystring from 'query-string';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FloatingActionButton from '../../components/FloatingActionButton';
import colors from '../../themes/color';
import styles from './style';
import notfound from '../../images/notfound.png';
import { actionCreators as placeActionCreators } from '../../redux/modules/place';
import { actionCreators as favouriteActionCreators } from '../../redux/modules/favourite';

type Place = {
  latitude: number;
  longitude: number;
  name: string;
  opening_hours: ?{ open_now: boolean };
  permanently_closed: ?boolean;
  place_id: string;
  rating: ?number;
  vicinity: string;
  geometry: Object;
};

type State = {
  photos: String[],
  listFound: boolean,
}

type Props = {
 doSetRes: Function,
 doDumpPhoto: Function,
 doAddNewPlace: Function,
 doCreateNewList: Function,
 visibility: boolean,
 photo: String[],
 place: Place,
 listTitle: string,
 favouriteList: Object[],
}

const PLACES_PHOTO_API = 'https://maps.googleapis.com/maps/api/place/photo?';
const key = Config.GOOGLE_MAPS_API_KEY;

class Restaurant extends React.Component<Props, State> {
  static props = {
    visibility: false,
    photo: [],
    place: null,
    listTitle: '',
  };

  state = {
    photos: [],
    listFound: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.photo !== nextProps.photo) {
      if (nextProps.photo.length > 0) {
        // fetch 4 photos from random starting index point
        if (nextProps.photo.length > 4) {
          let startPoint = nextProps.photo.length;
          while (startPoint + 3 > nextProps.photo.length - 1) {
            startPoint = Math.floor(Math.random() * (nextProps.photo.length));
          }
          this.fetchFourPhotos(startPoint, nextProps);
        } else {
          this.fetchFourPhotos(0, nextProps);
        }
      }
    }
  }

  componentDidUpdate() {
    if (this.props.listTitle !== '') {
      let found = false;
      // check if list existed
      for (let i = 0; i < this.props.favouriteList.length; i += 1) {
        const title = this.props.favouriteList.map((item) => {
          const temp = item.title;
          return temp;
        });
        if (title[i] === this.props.listTitle) {
          found = true;
          break;
        }
      }
      if (found) {
        this.listFound();
      }
    }
  }

  fetchFourPhotos(startPoint: number, nextProps: Props) {
    for (let i = 0; i < 4; i += 1) {
      this.fetchPhoto(nextProps.photo[startPoint + i]);
    }
  }

  // set listFound to true when list is found
  listFound() {
    if (!this.state.listFound) {
      this.setState({
        listFound: true,
      });
    }
  }

  // fetch photo url using photo reference id
  fetchPhoto(referenceId): void {
    const params = {
      photoreference: referenceId,
      maxheight: 150,
      maxweight: 150,
      key,
    };

    fetch(
      `${PLACES_PHOTO_API}${querystring.stringify(params)}`,
      {
        method: 'HEAD',
      },
    )
      .then((response) => {
        if (response) {
          const tempPhotos = this.state.photos;
          // prevent dummy photos
          if (response.url.search('googleapis') === -1) {
            tempPhotos.push(response.url);
            this.setState({
              photos: tempPhotos,
            });
          }
        }
      })
      .catch(() => {
        // Retry 5s later, inhibiting errors
        setTimeout(
          this.fetchPhoto(referenceId),
          5000,
        );
      });
  }

  handleBackButton() {
    if (this.props.visibility) {
      this.props.doSetRes(false);
      this.props.doDumpPhoto();
      this.setState({
        photos: [],
      });
    }

    return false;
  }

  actionButtonPressed() {
    ToastAndroid.show('New Place Added To List', ToastAndroid.SHORT);
    if (!this.state.listFound) {
      this.props.doCreateNewList(this.props.listTitle);
    }
    if (this.props.place !== null) {
      this.props.doAddNewPlace(this.props.place, this.props.listTitle);
      this.setState({
        listFound: false,
      });
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.visibility}
        transparent
        onRequestClose={() => { this.handleBackButton(); }}
      >
        <View style={styles.resContainer}>
          <View style={styles.resMainBox}>
            <View style={styles.resRowBox}>
              <View style={styles.resColBox}>
                <Image source={this.props.photo.length > 0 ? { uri: this.state.photos[0] } : notfound} alt="not found" style={styles.resPhoto} />
                <Image source={this.props.photo.length > 1 ? { uri: this.state.photos[1] } : notfound} alt="not found" style={styles.resPhoto} />
              </View>
              <View style={styles.resColBox}>
                <Image source={this.props.photo.length > 2 ? { uri: this.state.photos[2] } : notfound} alt="not found" style={styles.resPhoto} />
                <Image source={this.props.photo.length > 3 ? { uri: this.state.photos[3] } : notfound} alt="not found" style={styles.resPhoto} />
              </View>
            </View>
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
              <FloatingActionButton
                position="center"
                onPress={() => this.actionButtonPressed()}
                buttonColor={colors.accentColor2}
              >
                <Icon name="playlist-add" size={24} color="#fff" />
              </FloatingActionButton>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    visibility: state.place.res,
    photo: state.place.photos,
    listTitle: state.place.listTitle,
    favouriteList: state.favourite.favouriteList,
  };
}

const mapDispatchToProps = {
  doSetRes: placeActionCreators.doSetRes,
  doDumpPhoto: placeActionCreators.doDumpPhoto,
  doAddNewPlace: favouriteActionCreators.doAddNewPlace,
  doCreateNewList: favouriteActionCreators.doCreateNewList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Restaurant);
