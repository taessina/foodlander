import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../ducks/place';
import Home from './presenter';

function mapStateToProps(state) {
  const { places, index } = state.place;
  const { coordinate } = state.location;
  return {
    places,
    index,
    latitude: coordinate ? coordinate.latitude : null,
    longitude: coordinate ? coordinate.longitude : null,
    locationLocked: coordinate !== null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNearbyPlaces: bindActionCreators(placeActionCreators.doGetNearbyPlaces, dispatch),
    getNextPlace: bindActionCreators(placeActionCreators.doGetNextPlace, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
