// @flow
type Place = {
  latitude: number,
  longitude: number,
  name: string,
  opening_hours: ?{ open_now: boolean },
  permanently_closed: ?boolean,
  place_id: string,
  rating: ?number,
  vicinity: string,
  geometry: Object,
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
};

type RemovePlaceAction = {
  type: string,
  place: Place,
  title: string,
};

type RemoveListAction = {
  type: string,
  listTitle: string,
};

type Action = AddNewPlaceAction & CreateNewListAction & RemovePlaceAction & RemoveListAction;

const ADD_NEW_PLACE = 'favourite/ADD_NEW_PLACE';
const CREATE_NEW_LIST = 'favourite/CREATE_NEW_LIST;';
const REMOVE_PLACE = 'favourite/REMOVE_PLACE';
const REMOVE_LIST = 'favourite/REMOVE_LIST';

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

function doRemoveList(listTitle: string): RemoveListAction {
  return {
    type: REMOVE_LIST,
    listTitle,
  };
}

function doRemovePlace(place: Place, title: string): RemovePlaceAction {
  return {
    type: REMOVE_PLACE,
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

// remove a place
function applyRemovePlace(state: State, action: RemovePlaceAction) {
  const tempList = [];
  state.favouriteList.map((item) => {
    tempList.push(item);
    return null;
  });
  for (let i = 0; i < tempList.length; i += 1) {
    if (tempList[i].title === action.title) {
      const { items } = tempList[i];
      for (let u = 0; u < items.length; u += 1) {
        if (items[u].place_id === action.place.place_id) {
          tempList[i].items.splice(u, 1);
          break;
        }
      }
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

function applyRemoveList(state: State, action: RemoveListAction) {
  let newList = [];
  state.favouriteList.map((item) => {
    newList.push(item);
    return null;
  });

  if (newList.length > 1) {
    for (let i = 0; i < newList.length; i += 1) {
      if (action.listTitle === newList[i].title) {
        newList.splice(i, 1);
      }
    }
  } else {
    newList = [];
  }

  return { ...state, favouriteList: newList };
}

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case ADD_NEW_PLACE:
      return applyAddNewPlace(state, action);
    case CREATE_NEW_LIST:
      return applyCreateNewList(state, action);
    case REMOVE_PLACE:
      return applyRemovePlace(state, action);
    case REMOVE_LIST:
      return applyRemoveList(state, action);
    default:
      return state;
  }
}

const actionCreators = {
  doAddNewPlace,
  doRemovePlace,
  doCreateNewList,
  doRemoveList,
};

const actionTypes = {
  ADD_NEW_PLACE,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
