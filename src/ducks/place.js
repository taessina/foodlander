// @flow

type Place = {
  name: string;
  latitude: number;
  longitude: number;
};

type State = {
  places: Array<Place>;
  selectedPlace: Place;
};

type SetPlacesAction = {
  type: string;
  place: Array<Place>;
}

type SetPlaceAction = {
  type: string;
};

type Action = SetPlaceAction | SetPlacesAction;

import { Alert } from 'react-native';
import querystring from 'query-string';
import Config from 'react-native-config';

const PLACES_NEARBY_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const queryParams = {
  rankby: 'distance',
  types: 'restaurant',
  key: Config.GOOGLE_MAPS_API_KEY,
};

const SELETED_PLACE_SET = 'place/SELETED_PLACE_SET';
const PLACES_SET = 'place/PLACES_SET';

// Fisher-Yates shuffle
function shuffle(arr) {
  const array = arr;
  let m = array.length;
  let t;
  let i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function doSetPlaces(places: Array<Place>): SetPlacesAction {
  return {
    type: PLACES_SET,
    places: shuffle(places),
  };
}

function doGetNextPlace(): SetPlaceAction {
  return {
    type: SELETED_PLACE_SET,
  };
}

function doGetNearbyPlaces({ latitude: lat, longitude: lng }) {
  return (dispatch) => {
    const params = {
      location: `${lat},${lng}`,
      ...queryParams,
    };
    fetch(`${PLACES_NEARBY_API}${querystring.stringify(params)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          dispatch(doSetPlaces(data.results.map((result) => {
            const { name, geometry, vicinity } = result;
            const { lat: latitude, lng: longitude } = geometry.location;
            return {
              name,
              latitude,
              longitude,
              vicinity,
            };
          })));
        } else if (data.status === 'ZERO_RESULTS') {
          Alert.alert('Nothing found within 3km');
        } else {
          Alert.alert(data.error_message);
        }
      })
      .catch((e) => Alert.alert(e)
    );
  };
}

const initialState = {
  index: null,
  places: [],
};

function applySetPlaces(state, action) {
  const { places } = action;
  return { ...state, places };
}

function applySetSelectedPlace(state) {
  const index = state.index === null ? 0 : (state.index + 1) % state.places.length;
  return { ...state, index };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case PLACES_SET:
      return applySetPlaces(state, action);
    case SELETED_PLACE_SET:
      return applySetSelectedPlace(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doGetNearbyPlaces,
  doGetNextPlace,
};

const actionTypes = {
  PLACES_SET,
  SELETED_PLACE_SET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
