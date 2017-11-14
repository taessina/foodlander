// @flow
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../redux/modules/place';
import Home from './presenter';

function mapStateToProps(state) {
  const { places, index, area } = state.place;
  const { coordinate } = state.location;
  let lat = null;
  let lng = null;
  let isAreaSearch = false;

  if (area.latitude) {
    lat = area.latitude;
    lng = area.longitude;
    isAreaSearch = true;
  } else if (coordinate) {
    lat = coordinate.latitude;
    lng = coordinate.longitude;
  }

  return {
    places,
    index,
    latitude: lat === null ? 10 : lat,
    longitude: lng === null ? 110 : lng,
    delta: lat === null ? 50 : 0.01,
    isAreaSearch,
    locationLocked: coordinate !== null,
  };
}

const mapDispatchToProps = {
  getNearbyPlaces: placeActionCreators.doGetNearbyPlaces,
  getNextPlace: placeActionCreators.doGetNextPlace,
  resetArea: placeActionCreators.doResetArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
