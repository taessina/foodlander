// @flow

type Place = {
  name: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type State = {
  place: Place;
};

type SetPlaceAction = {
  type: string;
  place: Place;
};

type Action = SetPlaceAction;

import querystring from 'query-string';
import { actionCreators as navActionCreators } from '../ducks/navigation';

const PLACES_NEARBY_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const queryParams = {
  radius: 3000,
  types: 'restaurant',
  key: 'AIzaSyAUHiPKwFBti0xr0WiTcnJfXzcMK1bsOVM',
};

const PLACE_SET = 'place/PLACE_SET';

function doSetPlace(place: Place): SetPlaceAction {
  return {
    type: PLACE_SET,
    place,
  };
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function doGetRandomPlace({ latitude: lat, longitude: lng }) {
  return (dispatch) => {
    const params = {
      location: `${lat},${lng}`,
      ...queryParams,
    };
    fetch(`${PLACES_NEARBY_API}${querystring.stringify(params)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          const index = getRandomIntInclusive(0, data.results.length - 1);
          const { name, geometry } = data.results[index];
          const { lat: latitude, lng: longitude } = geometry.location;
          const latitudeDelta = geometry.viewport ?
            geometry.viewport.northeast.lat - geometry.viewport.southwest.lat : 0.004;
          const longitudeDelta = geometry.viewport ?
            geometry.viewport.northeast.lng - geometry.viewport.southwest.lng : 0.009;
          dispatch(doSetPlace({
            name,
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
          }));
          dispatch(navActionCreators.doNavigatePush({ key: 'place' }));
        } else if (data.status === 'ZERO_RESULTS') {
          alert('Nothing found within 3km');
        } else {
          alert(data.error_message);
        }
      })
      .catch((e) => alert(e));
  };
}

const initialState = {
  place: null,
};

function applySetPlace(state, action) {
  const { place } = action;
  return { ...state, selectedPlace: place };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case PLACE_SET:
      return applySetPlace(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doGetRandomPlace,
};

const actionTypes = {
  PLACE_SET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
