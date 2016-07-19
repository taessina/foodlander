import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Linking,
} from 'react-native';
import createStyleSheet from '../common/createStyleSheet';
import Touchable from '../common/F8Touchable';
import MapView from 'react-native-maps';

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

const styles = createStyleSheet({
  textContainer: {
    flex: 1,
    height: 60,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
  },
  button: {
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37474f',
    borderRadius: 20,
    margin: 16,
    elevation: 2,
    shadowColor: 'grey',
    shadowRadius: 2,
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default connect((state) => ({
  name: state.place.selectedPlace.name,
  latitude: state.place.selectedPlace.latitude,
  longitude: state.place.selectedPlace.longitude,
  latitudeDelta: state.place.selectedPlace.latitudeDelta,
  longitudeDelta: state.place.selectedPlace.longitudeDelta,
}))(Place);
