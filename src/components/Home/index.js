import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../ducks/place';
import Home from './presenter';

function mapStateToProps(state) {
  const { places, index, area } = state.place;
  const { coordinate } = state.location;
  let latitude = null;
  let longitude = null;
  let isAreaSearch = false;

  if (area.latitude) {
    latitude = area.latitude;
    longitude = area.longitude;
    isAreaSearch = true;
  } else if (coordinate) {
    latitude = coordinate.latitude;
    longitude = coordinate.longitude;
  }

  return {
    places,
    index,
    latitude,
    longitude,
    isAreaSearch,
    locationLocked: coordinate !== null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNearbyPlaces: bindActionCreators(placeActionCreators.doGetNearbyPlaces, dispatch),
    getNextPlace: bindActionCreators(placeActionCreators.doGetNextPlace, dispatch),
    resetArea: bindActionCreators(placeActionCreators.doResetArea, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
