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
  res: boolean;
  fav: boolean;
  photos: String[];
  extPlaces: Array<Place>;
  focPlaces: Array<Place>;
  listTitle: string;
  range: number;
};

type SetPlacesAction = {
  type: string;
  places: Array<Place>;
};

type SetAreaAction = {
  type: string;
  area: Area;
};

type SetModalAction = {
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

type ResetExtPlacesAction = {
  type: string;
}

type ResetFocPlacesAction = {
  type: string;
}


type SetListTitleAction = {
  type: string;
  title: string;
}

type SetFavModeAction = {
  type: string,
  mode: boolean,
}

type SetFavChoosedAction = {
  type: string,
  title: string,
}

type SetRangeAction = {
  type: string,
  range: number,
}

type Action = SetPlacesAction & SetAreaAction & SetModalAction & SetPhotosAction & HideModalAction &
UpdateIndexAction & ResetExtPlacesAction & SetListTitleAction & SetFavChoosedAction &
SetFavModeAction & SetRangeAction;

const PLACES_NEARBY_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
const PLACES_DETAIL_API = 'https://maps.googleapis.com/maps/api/place/details/json?';
const GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json?';
const key = Config.GOOGLE_MAPS_API_KEY;

const defaultRange = 2000;
const focusedRange = 500;
const extendedRange = 4000;

function getQuery(queryType: number): Object {
  return {
    key,
    radius: queryType,
  };
}

function getRestaurantQuery(queryType: number): Object {
  return {
    ...getQuery(queryType),
    types: 'restaurant',
  };
}

function getCafesQuery(queryType: number): Object {
  return {
    ...getQuery(queryType),
    types: 'cafe',
  };
}

const SELETED_PLACE_SET = 'place/SELETED_PLACE_SET';
const PLACES_SET = 'place/PLACES_SET';
const EXT_PLACES_SET = 'place/EXT_PLACES_SET';
const FOC_PLACES_SET = 'place/FOC_PLACES_SET';
const AREA_SET = 'place/AREA_SET';
const AREA_RESET = 'place/AREA_RESET';
const SET_RES = 'place/RES_SELECTED';
const SET_FAV = 'place/FAV_SELECTED';
const SET_PHOTOS = 'place/SET_PHOTOS';
const DUMP_PHOTO = 'place/DUMP_PHOTO';
const UPDATE_INDEX = 'place/UPDATE_INDEX';
const EXT_RESET = 'place/EXT_RESET';
const FOC_RESET = 'place/FOC_RESET';
const SET_LIST_TITLE = 'place/SET_LIST_TITLE';
const SET_FAV_MODE = 'place/SET_FAV_MODE';
const SET_FAV_CHOOSED = 'place/SET_FAV_CHOOSED';
const SET_RANGE = 'place/SET_RANGE';

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

function doSetFocusedPlaces(places: Array<Place>): SetPlacesAction {
  return {
    type: FOC_PLACES_SET,
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

function doSetRes(modal: boolean): SetModalAction {
  return {
    type: SET_RES,
    modal,
  };
}

function doSetFav(modal: boolean): SetModalAction {
  return {
    type: SET_FAV,
    modal,
  };
}

function doSetPhotos(photos: String[]): SetPhotosAction {
  return {
    type: SET_PHOTOS,
    photos,
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

function doResetExtPlaces(): ResetExtPlacesAction {
  return {
    type: EXT_RESET,
  };
}

function doResetFocPlaces(): ResetFocPlacesAction {
  return {
    type: FOC_RESET,
  };
}

function doSetListTitle(title: string): SetListTitleAction {
  return {
    type: SET_LIST_TITLE,
    title,
  };
}

function doSetFavMode(mode: boolean): SetFavModeAction {
  return {
    type: SET_FAV_MODE,
    mode,
  };
}

function doSetFavChoosed(title: string): SetFavChoosedAction {
  return {
    type: SET_FAV_CHOOSED,
    title,
  };
}

function doSetRange(range: number): SetRangeAction {
  return {
    type: SET_RANGE,
    range,
  };
}

// fetch nearby places
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

// get nearby places by calling fetchPlaces
function doGetNearbyPlaces({ latitude: lat, longitude: lng }: Object) {
  return (dispatch: Function): void => {
    Promise.all([
      fetchPlaces({
        location: `${lat},${lng}`,
        ...getRestaurantQuery(defaultRange),
      }),
      fetchPlaces({
        location: `${lat},${lng}`,
        ...getCafesQuery(defaultRange),
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

// get Extended Places by calling fetch places
function doGetExtendedPlaces({ latitude: lat, longitude: lng }: Object) {
  return (dispatch: Function): void => {
    Promise.all([
      fetchPlaces({
        location: `${lat},${lng}`,
        ...getRestaurantQuery(extendedRange),
      }),
      fetchPlaces({
        location: `${lat},${lng}`,
        ...getCafesQuery(extendedRange),
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
      dispatch(doSetRange(extendedRange));
    }).catch(() => {
      // Retry 5s later, inhibiting errors
      setTimeout(
        () => dispatch(doGetExtendedPlaces({ latitude: lat, longitude: lng })),
        5000,
      );
    });
  };
}

// get focused Places by calling fetch places
function doGetFocusedPlaces({ latitude: lat, longitude: lng }: Object) {
  return (dispatch: Function): void => {
    Promise.all([
      fetchPlaces({
        location: `${lat},${lng}`,
        ...getRestaurantQuery(focusedRange),
      }),
      fetchPlaces({
        location: `${lat},${lng}`,
        ...getCafesQuery(focusedRange),
      }),
    ]).then((results) => {
      const places = [...results[0], ...results[1]];
      dispatch(doSetFocusedPlaces(places.map((place: Place) => {
        const { lat: latitude, lng: longitude } = place.geometry.location;
        return {
          latitude,
          longitude,
          ...place,
        };
      })));
      dispatch(doSetRange(focusedRange));
    }).catch(() => {
      // Retry 5s later, inhibiting errors
      setTimeout(
        () => dispatch(doGetFocusedPlaces({ latitude: lat, longitude: lng })),
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

// when marker selected, fetch address_components, and photos
function doPlaceSelected(id: String) {
  return (dispatch: Function): void => {
    const params = { placeid: id, key };
    let listTitle = '';
    fetch(`${PLACES_DETAIL_API}${querystring.stringify(params)}`)
      .then(response => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          dispatch(doSetRes(true));
          const { address_components: address } = data.result;
          let photoRef;
          photoRef = data.result.photos;
          if (photoRef === undefined) {
            photoRef = [];
          }
          address.map((components) => {
            if ((components.types[0] === 'locality') && (components.types[1] === 'political')) {
              listTitle = components.long_name;
            }
            return null;
          });
          let tempPhotoRef = [];
          tempPhotoRef = photoRef.map(photo => photo.photo_reference);
          if (tempPhotoRef.length > 0) {
            dispatch(doSetPhotos(tempPhotoRef));
          } else {
            dispatch(doDumpPhoto());
          }
          dispatch(doSetListTitle(listTitle));
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
  res: false,
  fav: false,
  photos: [],
  extPlaces: [], // extended places
  focPlaces: [],
  listTitle: '',
  favMode: false,
  favChoosed: '',
  range: 2000, // default radius
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

// turns Restaurant modal on / off
function applySetRestaurant(state: State, action: SetModalAction) {
  return { ...state, res: action.modal };
}

// turn favourite menu modal on / off
function applySetFav(state: State, action: SetModalAction) {
  return { ...state, fav: action.modal };
}

// store fetched photos into array
function applySetPhotos(state: State, action: SetPhotosAction) {
  return { ...state, photos: action.photos };
}

// empty photo array
function applyDumpPhoto(state: State) {
  return { ...state, photos: [] };
}


function applyUpdateIndex(state: State, action: UpdateIndexAction) {
  return { ...state, index: action.index };
}

// store extended places into state array
function applySetExtendedPlaces(state: State, action: SetPlacesAction) {
  const { places } = action;
  const extended = places.filter((place, index, array) => {
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

  return { ...state, extPlaces: shuffle(extended) };
}

// store focused places into state array
function applySetFocusedPlaces(state: State, action: SetPlacesAction) {
  const { places } = action;
  const focused = places.filter((place, index, array) => {
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

  return { ...state, focPlaces: shuffle(focused) };
}

// empty extended places array
function applyResetExtPlaces(state: State) {
  return { ...state, extPlaces: [] };
}

// empty focused places array
function applyResetFocPlaces(state: State) {
  return { ...state, focPlaces: [] };
}

// change list title to current list title
function applySetListTitle(state: State, action: SetListTitleAction) {
  return { ...state, listTitle: action.title };
}

// turn favourite mode on / off
function applySetFavMode(state: State, action: SetFavModeAction) {
  return { ...state, favMode: action.mode };
}

// store choosed favourite list title
function applySetFavChoosed(state: State, action: SetFavChoosedAction) {
  return { ...state, favChoosed: action.title };
}

// change range value
function applySetRange(state: State, action: SetRangeAction) {
  return { ...state, range: action.range };
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
    case SET_RES:
      return applySetRestaurant(state, action);
    case SET_FAV:
      return applySetFav(state, action);
    case SET_PHOTOS:
      return applySetPhotos(state, action);
    case DUMP_PHOTO:
      return applyDumpPhoto(state);
    case UPDATE_INDEX:
      return applyUpdateIndex(state, action);
    case EXT_PLACES_SET:
      return applySetExtendedPlaces(state, action);
    case FOC_PLACES_SET:
      return applySetFocusedPlaces(state, action);
    case EXT_RESET:
      return applyResetExtPlaces(state);
    case FOC_RESET:
      return applyResetFocPlaces(state);
    case SET_LIST_TITLE:
      return applySetListTitle(state, action);
    case SET_FAV_MODE:
      return applySetFavMode(state, action);
    case SET_FAV_CHOOSED:
      return applySetFavChoosed(state, action);
    case SET_RANGE:
      return applySetRange(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doGetNearbyPlaces,
  doGetNextPlace,
  doGetPlacesNearArea,
  doResetArea,
  doPlaceSelected,
  doSetRes,
  doSetFav,
  doDumpPhoto,
  doUpdateIndex,
  doGetExtendedPlaces,
  doGetFocusedPlaces,
  doResetExtPlaces,
  doResetFocPlaces,
  doSetListTitle,
  doSetFavMode,
  doSetFavChoosed,
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
