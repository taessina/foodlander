import { NavigationExperimental } from 'react-native';

const {
	Reducer: NavigationReducer,
} = NavigationExperimental;

export default NavigationReducer.StackReducer({ // eslint-disable-line new-cap
  getReducerForState: (initialState) => (
    (state, action) => {
      if (!state) { return initialState; }
      if (action.type === 'replace') {
        return ({ key: action.key, ...action });
      }
      return state;
    }
  ),
  getPushedReducerForAction: (action) => {
    if (action.type === 'push') {
      return () => ({ key: action.key, ...action });
    }
    return null;
  },
  initialState: {
    key: 'FLNavigation',
    index: 0,
    children: [
      { key: 'index' },
    ],
  },
});
