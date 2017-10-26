import React from 'react';
import propTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as locationActionCreators } from '../../ducks/location';
import { actionCreators as placeActionCreators } from '../../ducks/place';

const TWO_MINUTES = 2 * 60 * 1000;
const NETWORK_PROVIDER = 'NETWORK_PROVIDER';
const GPS_PROVIDER = 'GPS_PROVIDER';

class LocationMonitor extends React.Component {
  componentDidMount() {
    // Get a quick location
    this.getLocationByNetwork();

    // Update location if user is on the move
    this.getLocationByGPS();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.gpsWatcher);
    clearTimeout(this.networkLocationTimer);
    clearTimeout(this.gpsLocationTimer);
  }

  getLocationByNetwork() {
    navigator.geolocation.getCurrentPosition(
      position => this.handleNewLocation(position, NETWORK_PROVIDER),
      () => this.handleError(NETWORK_PROVIDER),
    );
  }

  getLocationByGPS(watch = false) {
    const options = { enableHighAccuracy: true, distanceFilter: 500 };
    if (watch) {
      this.gpsWatcher = navigator.geolocation.watchPosition(
        position => this.handleNewLocation(position, GPS_PROVIDER),
        () => this.handleError(GPS_PROVIDER),
        options,
      );
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.handleNewLocation(position, GPS_PROVIDER);
          this.getLocationByGPS(true);
        },
        () => this.handleError(GPS_PROVIDER),
        options,
      );
    }
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

  handleError(provider) {
    if (provider === GPS_PROVIDER) {
      this.gpsLocationTimer = setTimeout(() => this.getLocationByGPS(), 5000);
    } else {
      this.networkLocationTimer = setTimeout(() => this.getLocationByNetwork(), 5000);
    }
  }

  handleNewLocation(location, provider) {
    if (this.isBetterLocation(location)) {
      const { coords: coordinate, timestamp } = location;
      this.props.setLocation({
        coordinate,
        provider,
        timestamp,
      });
      this.props.getArea(coordinate);
    }
  }

  render() {
    return null;
  }
}

LocationMonitor.propTypes = {
  getArea: propTypes.func.isRequired,
  setLocation: propTypes.func.isRequired,
  coordinate: propTypes.objectOf.isRequired,
  timestamp: propTypes.number.isRequired,
  provider: propTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setLocation: bindActionCreators(locationActionCreators.doSetLocation, dispatch),
    getArea: bindActionCreators(locationActionCreators.doGetArea, dispatch),
    getNearbyPlaces: bindActionCreators(placeActionCreators.doGetNearbyPlaces, dispatch),
  };
}

export default connect(state => ({
  ...state.location,
}), mapDispatchToProps)(LocationMonitor);
