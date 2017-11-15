// @flow
import React from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Config from 'react-native-config';
import querystring from 'query-string';
import { connect } from 'react-redux';
import styles from './style';
import notfound from '../../images/notfound.png';
import { actionCreators as placeActionCreators } from '../../redux/modules/place';
import { actionCreators as favouriteActionCreators } from '../../redux/modules/favourite';
import listIcon from '../../images/listIcon.png';

type State = {
  photos: String[];
}

type Props = {
 doHideModal: Function,
 doDumpPhoto: Function,
 doAddNewPlace: Function,
 visibility: boolean,
 photo: String[],
 placeId: string,
}

const PLACES_PHOTO_API = 'https://maps.googleapis.com/maps/api/place/photo?';
const key = Config.GOOGLE_MAPS_API_KEY;

class Restaurant extends React.Component<Props, State> {
  static props = {
    visibility: false,
    photo: [],
    placeId: null,
  };

  state = {
    photos: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.photo.length > 0) {
      this.fetchPhoto(nextProps.photo[0]);
      this.fetchPhoto(nextProps.photo[1]);
      this.fetchPhoto(nextProps.photo[2]);
      this.fetchPhoto(nextProps.photo[3]);
    }
  }

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
          tempPhotos.push(response.url);
          this.setState({
            photos: tempPhotos,
          });
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
      this.props.doHideModal(false);
      this.props.doDumpPhoto();
      this.state.photos = [];
    }

    return false;
  }

  actionButtonPressed() {
    ToastAndroid.show('New Place Added To List', ToastAndroid.SHORT);
    if (this.props.placeId !== null) {
      this.props.doAddNewPlace(this.props.placeId);
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
                <Image source={this.props.photo.length > 0 ? { uri: this.state.photos[1] } : notfound} alt="not found" style={styles.resPhoto} />
              </View>
              <View style={styles.resColBox}>
                <Image source={this.props.photo.length > 0 ? { uri: this.state.photos[2] } : notfound} alt="not found" style={styles.resPhoto} />
                <Image source={this.props.photo.length > 0 ? { uri: this.state.photos[3] } : notfound} alt="not found" style={styles.resPhoto} />
              </View>
            </View>
            <View style={{ flex: 0.2, flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.actionButtonPressed()}>
                <Image source={listIcon} style={{ width: 60, height: 60 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    visibility: state.place.modal,
    photo: state.place.photos,
  };
}

const mapDispatchToProps = {
  doHideModal: placeActionCreators.doHideModal,
  doDumpPhoto: placeActionCreators.doDumpPhoto,
  doAddNewPlace: favouriteActionCreators.doAddNewPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(Restaurant);
