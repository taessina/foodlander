// @flow

type Place = {
  latitude: number;
  longitude: number;
  name: string;
  opening_hours: ?{ open_now: boolean };
  permanently_closed: ?boolean;
  place_id: string;
  rating: ?number;
  vicinity: string;
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
const key = Config.GOOGLE_MAPS_API_KEY;

const query = {
  key,
  radius: 5000,
};

const restaurantsQuery = {
  ...query,
  types: 'restaurant',
};

const cafesQuery = {
  ...query,
  types: 'cafe',
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
    places,
  };
}

function doGetNextPlace(): SetPlaceAction {
  return {
    type: SELETED_PLACE_SET,
  };
}

function fetchPlaces(params) {
  return new Promise((resolve, reject) => {
    fetch(`${PLACES_NEARBY_API}${querystring.stringify(params)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          resolve(data.results);
        } else if (data.status === 'ZERO_RESULTS') {
          resolve([]);
        }
        reject(data.status);
      }
    );
  });
}

function doGetNearbyPlaces({ latitude: lat, longitude: lng }) {
  return (dispatch) => {
    Promise.all([
      fetchPlaces({
        location: `${lat},${lng}`,
        ...restaurantsQuery,
      }),
      fetchPlaces({
        location: `${lat},${lng}`,
        ...cafesQuery,
      }),
    ]).then((results) => {
      const places = [...results[0], ...results[1]];
      dispatch(doSetPlaces(places.map((place: Place) => {
        const { lat: latitude, lng: longitude } = place.geometry.location;
        return {
          latitude,
          longitude,
          ...place,
        };
      })));
    }).catch((e) => Alert.alert(e.message));
  };
}

const initialState = {
  index: null,
  places: [],
};

function applySetPlaces(state, action) {
  const { places } = action;
  const newPlaces = places.filter((place, index, array) => {
    if (place.permanently_closed) {
      return false;
    } else if (place.opening_hours && !place.opening_hours.open_now) {
      return false;
    }

    if (array.findIndex((p) => p.place_id === place.place_id) === index) {
      return true;
    }

    return false;
  });

  return { ...state, places: shuffle(newPlaces) };
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
