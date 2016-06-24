import { combineReducers } from 'redux';
import navigation from './navigation';
import location from './location';

// glue all the reducers together into 1 root reducer
export default combineReducers({ navigation, location });

// Put reducer keys that you do NOT want stored to persistence here
export const persistentStoreBlacklist = [];
