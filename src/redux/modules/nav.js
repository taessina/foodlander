// @flow
import type { NavigationState, NavigationAction } from 'react-navigation';
import { Navigator } from '../../Navigator';

const initialState = Navigator.router.getStateForAction(Navigator.router.getActionForPathAndParams('Home'));

export default function reducer(state: NavigationState = initialState, action: NavigationAction) {
  const nextState = Navigator.router.getStateForAction(action, state);
  return nextState || state;
}
