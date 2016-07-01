import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
} from 'react-native';
import createStyleSheet from '../common/createStyleSheet';
import Touchable from '../common/F8Touchable';
import { push } from '../actions';
import MapView from 'react-native-maps';


class Place extends React.Component {
  render() {
    return (
      <View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{this.props.name}</Text>
        </View>
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: this.props.lat,
              longitude: this.props.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <MapView.Marker
              coordinate={{latitude: this.props.lat, longitude: this.props.lng}}
            />
          </MapView>
        </View>
        <View style={styles.buttonContainer}>
          <Touchable
            onPress={() => this.handleBtnPress()}
          >
            <View
              style={styles.button}
            >
              <Text style={styles.buttonText}>Navigate</Text>
            </View>
          </Touchable>
          <Touchable
            onPress={() => this.handleBtnPress()}
          >
            <View
              style={styles.button}
            >
              <Text style={styles.buttonText}>Retry</Text>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }
}

Place.propTypes = {
  name: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
  push: PropTypes.func,
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
  name: state.location.name,
  lat: state.location.lat,
  lng: state.location.lng,
}), { push })(Place);