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

type State = {
  coordinate: Coordinate;
  timestamp: number;
}

type SetCoordinateAction = {
  type: string;
  coordinate: Coordinate;
};

type Action = SetCoordinateAction;

const COORDINATE_SET = 'location/COORDINATE_SET';

export function doSetCoordinate(coordinate: Coordinate): SetCoordinateAction {
  return {
    type: COORDINATE_SET,
    coordinate,
  };
}

const initialState = {
  coordinate: null,
  timestamp: null,
};

function applySetCoordinate(state, action) {
  const { coordinate } = action;
  return {
    ...state,
    coordinate,
    timestamp: Date.now(),
  };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case COORDINATE_SET:
      return applySetCoordinate(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doSetCoordinate,
};

const actionTypes = {
  COORDINATE_SET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
