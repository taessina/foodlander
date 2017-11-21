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
  geometry: Object;
};

type State = {
    favouriteList: Object[],
    favouritePlace: Object,
};

type AddNewPlaceAction = {
    type: string,
    place: Place,
    title: string,
};

type CreateNewListAction = {
    type: string,
    listTitle: string,
}

type Action = AddNewPlaceAction & CreateNewListAction;

const ADD_NEW_PLACE = 'favourite/ADD_NEW_PLACE';
const CREATE_NEW_LIST = 'favourite/CREATE_NEW_LIST;';

function doCreateNewList(listTitle: string): CreateNewListAction {
  return {
    type: CREATE_NEW_LIST,
    listTitle,
  };
}

function doAddNewPlace(place: Place, title: string): AddNewPlaceAction {
  return {
    type: ADD_NEW_PLACE,
    place,
    title,
  };
}

const initialState = {
  favouriteList: [],
  favouritePlace: {},
};

// add new place into list
function applyAddNewPlace(state: State, action: AddNewPlaceAction) {
  const tempList = [];
  state.favouriteList.map(items => tempList.push(items));

  for (let i = 0; i < state.favouriteList.length; i += 1) {
    if (action.title === state.favouriteList[i].title) {
      // check for duplication
      let found = false;
      const { items } = tempList[i];
      for (let u = 0; u < items.length; u += 1) {
        if (items[u].place_id === action.place.place_id) {
          found = true;
          break;
        }
      }
      if (!found) {
        tempList[i].items.push(action.place);
      }
      break;
    }
  }
  return { ...state, favouriteList: tempList };
}

// create new list with new list title
function applyCreateNewList(state: State, action: CreateNewListAction) {
  const tempList = { title: action.listTitle, items: [] };
  const newList = [];
  for (let i = 0; i < state.favouriteList.length; i += 1) {
    newList.push(state.favouriteList[i]);
  }
  newList.push(tempList);
  return { ...state, favouriteList: newList };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ADD_NEW_PLACE:
      return applyAddNewPlace(state, action);
    case CREATE_NEW_LIST:
      return applyCreateNewList(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doAddNewPlace,
  doCreateNewList,
};

const actionTypes = {
  ADD_NEW_PLACE,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
