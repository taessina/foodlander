// @flow
import querystring from 'query-string';
import Config from 'react-native-config';

type Place = {
  latitude: number;
  longitude: number;
  name: string;
  opening_hours: ?{ open_now: boolean };
  permanently_closed: ?boolean;
  place_id: string;
  rating: ?number;
  vicinity: string;
  geometry: Object;
};

type Area = {
  keyword?: string;
  latitude?: number;
  longitude?: number;
};

type State = {
  places: Array<Place>;
  index: ?number;
  area: Area;
  modal: boolean;
  photos: String[];
  extPlaces: Array<Place>;
};

type SetPlacesAction = {
  type: string;
  places: Array<Place>;
};

type SetAreaAction = {
  type: string;
  area: Area;
};

type SetResAction = {
  type: string;
  modal: boolean;
};

type SetPhotosAction = {
  type: string;
  photos: String[];
};

type HideModalAction = {
  type: string;
  modal: boolean;
};

type DumpPhotoAction = {
  type: string;
};

type UpdateIndexAction = {
  type: string;
  index: number;
};

type Action = SetPlacesAction & SetAreaAction & SetResAction & SetPhotosAction & HideModalAction &
UpdateIndexAction;

const PLACES_NEARBY_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const PLACES_DETAIL_API = 'https://maps.googleapis.com/maps/api/place/details/json?';
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

// extendedQuery
const extQuery = {
  key,
  radius: 4000,
};

const extRestaurantsQuery = {
  ...extQuery,
  types: 'restaurant',
};

const extCafesQuery = {
  ...extQuery,
  types: 'cafe',
};

const SELETED_PLACE_SET = 'place/SELETED_PLACE_SET';
const PLACES_SET = 'place/PLACES_SET';
const EXT_PLACES_SET = 'place/EXT_PLACES_SET';
const AREA_SET = 'place/AREA_SET';
const AREA_RESET = 'place/AREA_RESET';
const RES_SELECTED = 'place/RES_SELECTED';
const SET_PHOTOS = 'place/SET_PHOTOS';
const HIDE_MODAL = 'place/HIDE_MODAL';
const DUMP_PHOTO = 'place/DUMP_PHOTO';
const UPDATE_INDEX = 'place/UPDATE_INDEX';

// Fisher-Yates shuffle
function shuffle(arr) {
  const array = arr;
  let m = array.length;
  let t;
  let i;
  while (m) {
    i = Math.floor(Math.random() * m);
    m -= 1;
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

function doSetExtendedPlaces(places: Array<Place>): SetPlacesAction {
  return {
    type: EXT_PLACES_SET,
    places,
  };
}

function doGetNextPlace() {
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

function doResetArea() {
  return {
    type: AREA_RESET,
  };
}

function doSetRes(modal: boolean): SetResAction {
  return {
    type: RES_SELECTED,
    modal,
  };
}

function doSetPhotos(photos: String[]): SetPhotosAction {
  return {
    type: SET_PHOTOS,
    photos,
  };
}

function doHideModal(modal: boolean): HideModalAction {
  return {
    type: HIDE_MODAL,
    modal,
  };
}

function doDumpPhoto(): DumpPhotoAction {
  return {
    type: DUMP_PHOTO,
  };
}

function doUpdateIndex(index: number): UpdateIndexAction {
  return {
    type: UPDATE_INDEX,
    index,
  };
}

function fetchPlaces(params) {
  return fetch(`${PLACES_NEARBY_API}${querystring.stringify(params)}`)
    .then(response => response.json())
    .then((data) => {
      if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
        return data.results;
      }
      throw data.status;
    });
}

function doGetNearbyPlaces({ latitude: lat, longitude: lng }: Object) {
  return (dispatch: Function): void => {
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
        5000,
      );
    });
  };
}

function doGetExtendedPlaces({ latitude: lat, longitude: lng }: Object) {
  return (dispatch: Function): void => {
    Promise.all([
      fetchPlaces({
        location: `${lat},${lng}`,
        ...extRestaurantsQuery,
      }),
      fetchPlaces({
        location: `${lat},${lng}`,
        ...extCafesQuery,
      }),
    ]).then((results) => {
      const places = [...results[0], ...results[1]];
      dispatch(doSetExtendedPlaces(places.map((place: Place) => {
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
        () => dispatch(doGetExtendedPlaces({ latitude: lat, longitude: lng })),
        5000,
      );
    });
  };
}

function doGetPlacesNearArea(keywords: Array<Object>) {
  return (dispatch: Function): void => {
    dispatch(doSetArea({ keyword: keywords[0].value }));
    // Get coordinate
    const params = { address: keywords.map(t => t.value).join(','), key };
    fetch(`${GEOCODING_API}${querystring.stringify(params)}`)
      .then(response => response.json())
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
          5000,
        );
      });
  };
}

function doMarkerSelected(id: String) {
  return (dispatch: Function): void => {
    const params = { placeid: id, key };
    fetch(`${PLACES_DETAIL_API}${querystring.stringify(params)}`)
      .then(response => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          dispatch(doSetRes(true));
          const { photos: photoRef } = data.result;
          const tempPhotoRef = photoRef.map(photo => photo.photo_reference);
          dispatch(doSetPhotos(tempPhotoRef));
          return data.result;
        }
        throw data.status;
      })
      .catch(() => {
      });
  };
}

const initialState = {
  index: null,
  places: [],
  area: {},
  modal: false,
  photos: [],
  extPlaces: [], // extended places
};

function applySetPlaces(state: State, action: SetPlacesAction) {
  const { places } = action;
  const newPlaces = places.filter((place, index, array) => {
    if (place.permanently_closed) {
      return false;
    } else if (place.opening_hours && !place.opening_hours.open_now) {
      return false;
    }

    if (array.findIndex(p => p.place_id === place.place_id) === index) {
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

function applySetArea(state: State, action: SetAreaAction) {
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

function applyResetArea(state: State) {
  return { ...state, area: {} };
}

function applySetRestaurant(state: State, action: SetResAction) {
  return { ...state, modal: action.modal };
}

function applySetPhotos(state: State, action: SetPhotosAction) {
  return { ...state, photos: action.photos };
}

function applyHideModal(state: State, action: HideModalAction) {
  return { ...state, modal: action.modal };
}

function applyDumpPhoto(state: State) {
  return { ...state, photos: [] };
}

function applyUpdateIndex(state: State, action: UpdateIndexAction) {
  return { ...state, index: action.index };
}

function applySetExtendedPlaces(state: State, action: SetPlacesAction) {
  const { places } = action;
  const newPlaces = places.filter((place, index, array) => {
    if (place.permanently_closed) {
      return false;
    } else if (place.opening_hours && !place.opening_hours.open_now) {
      return false;
    }

    if (array.findIndex(p => p.place_id === place.place_id) === index) {
      return true;
    }

    return false;
  });

  // extract the extended places
  const extended = [];
  for (let i = 0; i < newPlaces.length; i += 1) {
    const { place_id: newPlace } = newPlaces[i];
    let found = false;
    for (let u = 0; u < state.places.length; u += 1) {
      const { place_id: prevPlace } = state.places[u];
      if (newPlace === prevPlace) {
        found = true;
        break;
      }
    }
    if (!found) {
      extended.push(newPlaces[i]);
    }
  }
  return { ...state, extPlaces: shuffle(extended), index: null };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case PLACES_SET:
      return applySetPlaces(state, action);
    case SELETED_PLACE_SET:
      return applySetSelectedPlace(state);
    case AREA_SET:
      return applySetArea(state, action);
    case AREA_RESET:
      return applyResetArea(state);
    case RES_SELECTED:
      return applySetRestaurant(state, action);
    case SET_PHOTOS:
      return applySetPhotos(state, action);
    case HIDE_MODAL:
      return applyHideModal(state, action);
    case DUMP_PHOTO:
      return applyDumpPhoto(state);
    case UPDATE_INDEX:
      return applyUpdateIndex(state, action);
    case EXT_PLACES_SET:
      return applySetExtendedPlaces(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doGetNearbyPlaces,
  doGetNextPlace,
  doGetPlacesNearArea,
  doResetArea,
  doMarkerSelected,
  doHideModal,
  doDumpPhoto,
  doUpdateIndex,
  doGetExtendedPlaces,
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
