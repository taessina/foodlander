import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from '../reducers';

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent; // eslint-disable-line

const logger = createLogger({
  predicate: () => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

const config = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(config, reducers);

export default function configureStore() {
  /*
  configure { storage: AsyncStorage }, onComplete
  */

  const enhancer = compose(applyMiddleware(thunk, logger));
  const store = createStore(persistedReducer, enhancer);

  const persistedStore = persistStore(store);

  if (isDebuggingInChrome) {
    window.store = store;
  }

  return { persistedStore, store };
}
