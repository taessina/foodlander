// @flow
import {
  NavigationExperimental,
} from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

// *** Action Types ***
export const NAVIGATE = 'navigation/NAVIGATE';
export const NAV_PUSH = 'navigation/NAV_PUSH';
export const NAV_POP = 'navigation/NAV_POP';
export const NAV_JUMP_TO_KEY = 'navigation/NAV_JUMP_TO_KEY';
export const NAV_JUMP_TO_INDEX = 'navigation/NAV_JUMP_TO_INDEX';
export const NAV_RESET = 'navigation/NAV_RESET';

// *** Action Creators ***
export function doNavigatePush(state: Object|string): Object {
  // eslint-disable-next-line no-param-reassign
  state = typeof state === 'string' ? { key: state, title: state } : state;
  return {
    type: NAV_PUSH,
    state,
  };
}

export function doNavigatePop(): Object {
  return {
    type: NAV_POP,
  };
}

export function doNavigateJumpToKey(key: string): Object {
  return {
    type: NAV_JUMP_TO_KEY,
    key,
  };
}

export function doNavigateJumpToIndex(index: number): Object {
  return {
    type: NAV_JUMP_TO_INDEX,
    index,
  };
}

export function doNavigateReset(routes: Array<Object>, index: number): Object {
  return {
    type: NAV_RESET,
    index,
    routes,
  };
}

// *** Initial state ***
const initialNavState = {
  key: 'FLNavigation',
  index: 0,
  routes: [
    { key: 'index' },
  ],
};

// *** Reducer ***
function reducer(state: NavigationState = initialNavState,
  action: NavigationAction): NavigationState {
  switch (action.type) {
    case NAV_PUSH:
      if (state.routes[state.index].key === (action.state && action.state.key)) {
        return state;
      }
      return NavigationStateUtils.push(state, action.state);

    case NAV_POP:
      if (state.index === 0 || state.routes.length === 1) {
        return state;
      }
      return NavigationStateUtils.pop(state);

    case NAV_JUMP_TO_KEY:
      return NavigationStateUtils.jumpTo(state, action.key);

    case NAV_JUMP_TO_INDEX:
      return NavigationStateUtils.jumpToIndex(state, action.index);

    case NAV_RESET:
      return {
        ...state,
        index: action.index,
        routes: action.routes,
      };

    default:
      return state;
  }
}

const actionCreators = {
  doNavigateReset,
  doNavigatePop,
  doNavigatePush,
  doNavigateJumpToKey,
  doNavigateJumpToIndex,
};

const actionTypes = {
  NAVIGATE,
  NAV_PUSH,
  NAV_POP,
  NAV_JUMP_TO_KEY,
  NAV_JUMP_TO_INDEX,
  NAV_RESET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
