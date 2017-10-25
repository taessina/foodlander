import { combineReducers } from 'redux';
import place from '../ducks/place';
import location from '../ducks/location';

// glue all the reducers together into 1 root reducer
export default combineReducers({ place, location });

// Put reducer keys that you do NOT want stored to persistence here
export const persistentStoreBlacklist = [];
