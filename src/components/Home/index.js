import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../ducks/place';
import Home from './presenter';

function mapStateToProps(state) {
  const { places, selectedPlace } = state.place;
  const { coordinate } = state.location;
  return {
    places,
    selectedPlace,
    latitude: coordinate ? coordinate.latitude : 0,
    longitude: coordinate ? coordinate.longitude : 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNearbyPlaces: bindActionCreators(placeActionCreators.doGetNearbyPlaces, dispatch),
    doSetSelectedPlace: bindActionCreators(placeActionCreators.doSetSelectedPlace, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
