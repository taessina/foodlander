import React, { PropTypes } from 'react';
import {
  Text,
  TouchableNativeFeedback,
  View,
  Linking,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../common/F8Touchable';
import styles from './style';

class Place extends React.Component {
  handleNavigateBtnPress() {
    const { name, latitude, longitude } = this.props;
    const url = `geo:${latitude},${longitude}?q=${name}`;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  render() {
    const { name, latitude, longitude, latitudeDelta, longitudeDelta, vicinity } = this.props;
    const buttonBackground =
      TouchableNativeFeedback.Ripple('#EFF6E0', false); // eslint-disable-line new-cap
    return (
      <View style={styles.container}>
        <MapView
          loadingEnabled
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          }}
        >
          <MapView.Marker
            coordinate={{ latitude, longitude }}
          />
        </MapView>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.subtext}>{vicinity}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Touchable
            background={buttonBackground}
            onPress={() => this.handleNavigateBtnPress()}
          >
            <View style={styles.button} >
              <Icon name="navigation" size={24} color="#fff" />
            </View>
          </Touchable>
        </View>
      </View>
    );
  }
}

Place.propTypes = {
  name: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  latitudeDelta: PropTypes.number,
  longitudeDelta: PropTypes.number,
  vicinity: PropTypes.string,
};

export default Place;
