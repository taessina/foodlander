import {
  NavigationExperimental,
} from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

/* Action Types */
export const PUSH = 'navigation/PUSH';
export const POP = 'navigation/POP';
export const JUMP_TO_KEY = 'navigation/JUMP_TO_KEY';
export const JUMP_TO_INDEX = 'navigation/JUMP_TO_INDEX';
export const RESET = 'navigation/RESET';
export const REPLACE = 'navigation/REPLACE';

/* Action Creators */
export function doPush(state: Object|string): Object {
  const newState = typeof state === 'string' ? { key: state, title: state } : state;
  return {
    type: PUSH,
    state: newState,
  };
}

export function doPop(): Object {
  return {
    type: POP,
  };
}

export function doJumpToKey(key: string): Object {
  return {
    type: JUMP_TO_KEY,
    key,
  };
}

export function doJumpToIndex(index: number): Object {
  return {
    type: JUMP_TO_INDEX,
    index,
  };
}

export function doReset(routes: Array<Object>, index: number): Object {
  return {
    type: RESET,
    index,
    routes,
  };
}

export function doReplace(key: string, route: Object): Object {
  return {
    type: REPLACE,
    key,
    route,
  };
}

/* Initial state */
const initialNavState = {
  key: 'Navigation',
  index: 0,
  routes: [
    { key: 'splashscreen' },
  ],
};

/* Reducer */
function reducer(state: NavigationState = initialNavState,
  action: NavigationAction): NavigationState {
  switch (action.type) {
    case PUSH:
      if (state.routes[state.index].key === (action.state && action.state.key)) {
        return state;
      }
      return NavigationStateUtils.push(state, action.state);

    case POP:
      if (state.index === 0 || state.routes.length === 1) {
        return state;
      }
      return NavigationStateUtils.pop(state);

    case JUMP_TO_KEY:
      return NavigationStateUtils.jumpTo(state, action.key);

    case JUMP_TO_INDEX:
      return NavigationStateUtils.jumpToIndex(state, action.index);

    case REPLACE:
      return NavigationStateUtils.replaceAt(state, action.key, action.route);

    case RESET:
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
  doReset,
  doPop,
  doPush,
  doJumpToKey,
  doJumpToIndex,
  doReplace,
};

const actionTypes = {
  PUSH,
  POP,
  JUMP_TO_KEY,
  JUMP_TO_INDEX,
  RESET,
};

export {
  actionCreators,
  actionTypes,
};

export default reducer;
