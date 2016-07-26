import React, { PropTypes } from 'react';
import { Alert } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as locationActionCreators } from '../../ducks/location';
import { actionCreators as placeActionCreators } from '../../ducks/place';

const TWO_MINUTES = 2 * 60 * 1000;
const NETWORK_PROVIDER = 'NETWORK_PROVIDER';
const GPS_PROVIDER = 'GPS_PROVIDER';

class LocationMonitor extends React.Component {
  componentDidMount() {
    // Get location from network provider
    navigator.geolocation.getCurrentPosition(
      (position) => this.handleNewLocation(position, NETWORK_PROVIDER),
      (error) => this.handleError(error, NETWORK_PROVIDER)
    );

    // Get location from GPS provider
    navigator.geolocation.getCurrentPosition(
      (position) => this.handleNewLocation(position, GPS_PROVIDER),
      (error) => this.handleError(error, GPS_PROVIDER),
      { enableHighAccuracy: true }
    );

    // Listen for location changes from GPS provider
    this.gpsWatcher = navigator.geolocation.watchPosition(
      (position) => this.handleNewLocation(position, GPS_PROVIDER),
      (error) => this.handleError(error, GPS_PROVIDER),
      { enableHighAccuracy: true, distanceFilter: 500 }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.gpsWatcher);
  }

  isBetterLocation(newLocation) {
    const { coords: newCoords, timestamp: newTimestamp, provider: newProvider } = newLocation;
    const {
      coordinate: currentCoords,
      timestamp: currentTimestamp,
      provider: currentProvider,
    } = this.props;

    if (currentTimestamp) {
      const timeDelta = newTimestamp - currentTimestamp;
      const isSignificantlyNewer = timeDelta > TWO_MINUTES;
      const isSignificantlyOlder = timeDelta < -TWO_MINUTES;
      const isNewer = timeDelta > 0;
      const accuracyDelta = newCoords.accuracy - currentCoords.accuracy;
      const isLessAccurate = accuracyDelta > 0;
      const isMoreAccurate = accuracyDelta < 0;
      const isSignificantlyLessAccurate = accuracyDelta > 200;
      const isSameProvider = newProvider === currentProvider;

      if (isSignificantlyNewer) {
        return true;
      } else if (isSignificantlyOlder) {
        return false;
      }

      if (isMoreAccurate) {
        return true;
      } else if (isNewer && !isLessAccurate) {
        return true;
      } else if (isNewer && !isSignificantlyLessAccurate && isSameProvider) {
        return true;
      }

      return false;
    }

    return true;
  }

  handleNewLocation(location, provider) {
    if (this.isBetterLocation(location)) {
      const { coords: coordinate, timestamp } = location;
      this.props.setLocation({
        coordinate,
        provider,
        timestamp,
      });
      this.props.getNearbyPlaces(coordinate);
    }
  }

  handleError(error, provider) {
    // Suppress error reporting
    if (this.reported || provider === NETWORK_PROVIDER || this.props.coordinate) {
      return;
    }

    this.reported = true;

    Alert.alert(
      `${error}`,
      'Please ensure GPS is enabled or try going outdoor, then restart the app.',
      [{ text: 'OK' }]
    );
  }

  render() {
    return null;
  }
}

LocationMonitor.propTypes = {
  setLocation: PropTypes.func,
  getNearbyPlaces: PropTypes.func,
  coordinate: PropTypes.object,
  timestamp: PropTypes.number,
  provider: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    setLocation: bindActionCreators(locationActionCreators.doSetLocation, dispatch),
    getNearbyPlaces: bindActionCreators(placeActionCreators.doGetNearbyPlaces, dispatch),
  };
}

export default connect((state) => ({
  ...state.location,
}), mapDispatchToProps)(LocationMonitor);
