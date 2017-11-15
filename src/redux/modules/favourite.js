// @flow
type State = {
    favouriteList: string[],
    favouritePlace: Object,
};

type AddNewPlaceAction = {
    type: string,
    placeId: string,
};

type Action = AddNewPlaceAction;

const ADD_NEW_PLACE = 'favourite/ADD_NEW_PLACE';

function doAddNewPlace(placeId: string): AddNewPlaceAction {
  return {
    type: ADD_NEW_PLACE,
    placeId,
  };
}

const initialState = {
  favouriteList: [],
  favouritePlace: {},
};

function applyAddNewPlace(state: State, action: AddNewPlaceAction) {
  const tempList = [];

  for (let i = 0; i < state.favouriteList.length; i += 1) {
    tempList.push(state.favouriteList[i]);
  }

  tempList.push(action.placeId);
  return { ...state, favouriteList: tempList };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ADD_NEW_PLACE:
      return applyAddNewPlace(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doAddNewPlace,
};

const actionTypes = {
  ADD_NEW_PLACE,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
