// @flow

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
  coordinate: Coordinate;
  provider: string;
  timestamp: number;
}

type SetLocationAction = {
  type: string;
  location: Location;
};

type Action = SetCoordinateAction;

const LOCATION_SET = 'location/LOCATION_SET';

export function doSetLocation(location: Location): SetLocationAction {
  return {
    type: LOCATION_SET,
    location,
  };
}

const initialState = {
  coordinate: null,
  provider: null,
  timestamp: null,
};

function applySetLocation(state, action) {
  const { coordinate, provider, timestamp } = action.location;
  return {
    coordinate,
    provider,
    timestamp,
  };
}

function reducer(state: Location = initialState, action: Action): Location {
  switch (action.type) {
    case LOCATION_SET:
      return applySetLocation(state, action);
    default:
      return state;
  }
}

const actionCreators = {
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
