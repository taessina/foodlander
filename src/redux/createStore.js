// @flow
import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import thunk from 'redux-thunk';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { createLogger } from 'redux-logger';

import reducers, { blacklist } from './modules';
import { middleware as reactNavigationReduxMiddleware } from './react-navigation';

const isDebuggingInChrome = __DEV__ && !!(window && window.navigator && window.navigator.userAgent);

const logger = createLogger({
  predicate: () => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

const config = {
  key: 'root',
  storage,
  blacklist,
};

export default function configureStore() {
  let enhancer;
  if (__DEV__) {
    enhancer = compose(
      applyMiddleware(reactNavigationReduxMiddleware, thunk, reduxPackMiddleware, logger)
    );
  } else {
    enhancer = compose(applyMiddleware(reactNavigationReduxMiddleware, thunk, reduxPackMiddleware));
  }
  const store = createStore(persistCombineReducers(config, reducers), enhancer);
  const persistor = persistStore(store);
  // persistor.purge();
  if (isDebuggingInChrome) {
    window.store = store;
  }

  return { persistor, store };
}
