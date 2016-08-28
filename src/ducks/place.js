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

type Area = {
  keyword: string;
  latitude: number;
  longitude: number;
};

type State = {
  places: Array<Place>;
  selectedPlace: Place;
  area: Area;
};

type SetPlacesAction = {
  type: string;
  place: Array<Place>;
}

type SetPlaceAction = {
  type: string;
};

type SetAreaAction = {
  type: string;
  keyword: string;
  latitude: number;
  longitude: number;
};

type ResetAreaAction = {
  type: string;
};

type Action = SetPlaceAction | SetPlacesAction | SetAreaAction | ResetAreaAction;

import querystring from 'query-string';
import Config from 'react-native-config';

const PLACES_NEARBY_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json?';
const key = Config.GOOGLE_MAPS_API_KEY;

const query = {
  key,
  radius: 2000,
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
const AREA_SET = 'place/AREA_SET';
const AREA_RESET = 'place/AREA_RESET';

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

function doSetArea(area: Area): SetAreaAction {
  return {
    type: AREA_SET,
    area,
  };
}

function doResetArea(): ResetAreaAction {
  return {
    type: AREA_RESET,
  };
}

function fetchPlaces(params) {
  return fetch(`${PLACES_NEARBY_API}${querystring.stringify(params)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
        return data.results;
      }
      throw data.status;
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
    }).catch(() => {
      // Retry 5s later, inhibiting errors
      setTimeout(
        () => dispatch(doGetNearbyPlaces({ latitude: lat, longitude: lng })),
        5000
      );
    });
  };
}

function doGetPlacesNearArea(keywords: Array) {
  return (dispatch) => {
    dispatch(doSetArea({ keyword: keywords[0].value }));
    // Get coordinate
    const params = { address: keywords.map((t) => t.value).join(','), key };
    fetch(`${GEOCODING_API}${querystring.stringify(params)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          const { lat: latitude, lng: longitude } = data.results[0].geometry.location;
          dispatch(doSetArea({ latitude, longitude }));
          dispatch(doGetNearbyPlaces({ latitude, longitude }));
        } else if (data.status === 'ZERO_RESULTS') {
          dispatch(doSetPlaces([]));
        } else {
          throw data.status;
        }
      })
      .catch(() => {
        // Retry 5s later, inhibiting errors
        setTimeout(
          () => dispatch(doGetPlacesNearArea(keywords)),
          5000
        );
      });
  };
}

const initialState = {
  index: null,
  places: [],
  area: {},
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

  return { ...state, places: shuffle(newPlaces), index: null };
}

function applySetSelectedPlace(state) {
  const index = state.index === null ? 0 : (state.index + 1) % state.places.length;
  return { ...state, index };
}

function applySetArea(state, action) {
  const { area } = action;
  const { keyword, latitude, longitude } = area;
  return {
    ...state,
    area: {
      keyword: keyword || state.area.keyword,
      latitude: latitude || state.area.latitude,
      longitude: longitude || state.area.longitude,
    },
  };
}

function applyResetArea(state) {
  return { ...state, area: {} };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case PLACES_SET:
      return applySetPlaces(state, action);
    case SELETED_PLACE_SET:
      return applySetSelectedPlace(state, action);
    case AREA_SET:
      return applySetArea(state, action);
    case AREA_RESET:
      return applyResetArea(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doGetNearbyPlaces,
  doGetNextPlace,
  doGetPlacesNearArea,
  doResetArea,
};

const actionTypes = {
  PLACES_SET,
  SELETED_PLACE_SET,
  AREA_SET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
