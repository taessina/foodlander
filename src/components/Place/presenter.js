import React, { PropTypes } from 'react';
import {
  Text,
  View,
  Linking,
} from 'react-native';
import MapView from 'react-native-maps';
import Touchable from '../common/F8Touchable';
import styles from './style';

class Place extends React.Component {
  handleNavigateBtnPress() {
    const { name } = this.props;
    const url = `google.navigation:q=${name}`;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  render() {
    const { name, latitude, longitude, latitudeDelta, longitudeDelta } = this.props;
    return (
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{name}</Text>
        </View>
        <View style={styles.container}>
          <MapView
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
        </View>
        <View style={styles.buttonContainer}>
          <Touchable
            onPress={() => this.handleNavigateBtnPress()}
          >
            <View
              style={styles.button}
            >
              <Text style={styles.buttonText}>Navigate</Text>
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
};

export default Place;
