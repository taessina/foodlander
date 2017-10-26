// @flow

import querystring from 'query-string';
import Config from 'react-native-config';

type Coordinate = {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  altitudeAccuracy: number;
  heading: number;
  speed: number;
};

type Location = {
  coordinate: ?Coordinate;
  provider: ?string;
  timestamp: ?number;
}

type SetLocationAction = {
  type: string;
  location: Location;
};

type SetAreaAction = {
  type: string;
  area: ?string;
}

type Action = SetLocationAction & SetAreaAction;
type State = Location & { area: ?string };

const GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json?';
const key = Config.GOOGLE_MAPS_API_KEY;

const LOCATION_SET = 'location/LOCATION_SET';
const AREA_SET = 'location/AREA_SET';

const query = { key };

function doSetLocation(location: Location): SetLocationAction {
  return {
    type: LOCATION_SET,
    location,
  };
}

function doSetArea(area: ?string): SetAreaAction {
  return {
    type: AREA_SET,
    area,
  };
}

function doGetArea({ latitude, longitude }: Object) {
  return (dispatch: Function) => {
    const params = {
      latlng: `${latitude},${longitude}`,
      ...query,
    };
    fetch(`${GEOCODING_API}${querystring.stringify(params)}`)
      .then(response => response.json())
      .then((data) => {
        if (data.status === 'OK') {
          const area = data.results.find(result => result.types.includes('sublocality'))
            .address_components[0].long_name;
          dispatch(doSetArea(area));
        } else if (data.status === 'ZERO_RESULTS') {
          dispatch(doSetArea(null));
        } else {
          throw data.status;
        }
      })
      .catch(() => {
        // Retry 5s later, inhibiting errors
        setTimeout(
          () => dispatch(doGetArea({ latitude, longitude })),
          5000,
        );
      });
  };
}

const initialState = {
  coordinate: null,
  provider: null,
  timestamp: null,
  area: null,
};

function applySetLocation(state: State, action: SetLocationAction) {
  const { coordinate, provider, timestamp } = action.location;
  return {
    ...state,
    coordinate,
    provider,
    timestamp,
  };
}

function applySetArea(state: State, action: SetAreaAction) {
  const { area } = action;
  return {
    ...state,
    area,
  };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case LOCATION_SET:
      return applySetLocation(state, action);
    case AREA_SET:
      return applySetArea(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doGetArea,
  doSetLocation,
};

const actionTypes = {
  LOCATION_SET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
