import React, { PropTypes } from 'react';
import { Alert } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as locationActionCreators } from '../../ducks/location';

class LocationMonitor extends React.Component {
  componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const { coords } = position;
      this.props.doSetCoordinate({
        ...coords,
      });
    },
    () => {
      if (!this.reported) {
        Alert.alert(
          null,
          'Please ensure GPS is enabled or try going outdoor.',
          [{ text: 'OK' }]);
      }
      this.reported = true;
    }, { enableHighAccuracy: true });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return null;
  }
}

LocationMonitor.propTypes = {
  doSetCoordinate: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    doSetCoordinate: bindActionCreators(locationActionCreators.doSetCoordinate, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(LocationMonitor);
