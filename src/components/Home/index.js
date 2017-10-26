import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../ducks/place';
import Home from './presenter';

function mapStateToProps(state) {
  const { places, index, area } = state.place;
  const { coordinate } = state.location;

  const { latitude } = area;
  const { longitude } = area;

  let lat = null;
  let lng = null;
  let isAreaSearch = false;

  if (latitude) {
    lat = latitude;
    lng = longitude;
    isAreaSearch = true;
  } else if (coordinate) {
    lat = coordinate.latitude;
    lng = coordinate.longitude;
  }

  return {
    places,
    index,
    lat,
    lng,
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
