// @flow
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../redux/modules/place';
import { actionCreators as favActionCreators } from '../../redux/modules/favourite';
import Home from './presenter';

function mapStateToProps(state) {
  const {
    places, index, area, res, extPlaces, focPlaces, favMode, favChoosed, fav, photos, listTitle,
  } = state.place;

  const { coordinate } = state.location;

  const { favouriteList } = state.favourite;

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
    resModal: res,
    places,
    extPlaces,
    focPlaces,
    index,
    latitude: lat === null ? 10 : lat,
    longitude: lng === null ? 110 : lng,
    delta: lat === null ? 50 : 0.01,
    isAreaSearch,
    locationLocked: coordinate !== null,
    favouriteList,
    favMode,
    favChoosed,
    favMenu: fav,
    photos,
    listTitle,
  };
}

const mapDispatchToProps = {
  getNearbyPlaces: placeActionCreators.doGetNearbyPlaces,
  getNextPlace: placeActionCreators.doGetNextPlace,
  resetArea: placeActionCreators.doResetArea,
  doPlaceSelected: placeActionCreators.doPlaceSelected,
  getExtendedPlace: placeActionCreators.doGetExtendedPlaces,
  getFocusedPlace: placeActionCreators.doGetFocusedPlaces,
  resetExtPlaces: placeActionCreators.doResetExtPlaces,
  resetFocPlaces: placeActionCreators.doResetFocPlaces,
  doSetFav: placeActionCreators.doSetFav,
  doSetFavMode: placeActionCreators.doSetFavMode,
  doSetFavChoosed: placeActionCreators.doSetFavChoosed,
  doCreateNewList: favActionCreators.doCreateNewList,
  doAddNewPlace: favActionCreators.doAddNewPlace,
  doRemoveList: favActionCreators.doRemoveList,
  doRemovePlace: favActionCreators.doRemovePlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
