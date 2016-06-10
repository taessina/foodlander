import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import sagas from '../sagas';

import reducers from '../reducers';

const sagaMiddleware = createSagaMiddleware();
const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent; // eslint-disable-line

const logger = createLogger({
  predicate: () => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

export default function configureStore(onComplete: ?() => void) {
  const enhancer = compose(autoRehydrate(), applyMiddleware(sagaMiddleware, thunk, logger));
  const store = createStore(reducers, enhancer);
  persistStore(store, { storage: AsyncStorage }, onComplete).purgeAll();
  if (isDebuggingInChrome) {
    window.store = store;
  }

  sagaMiddleware.run(sagas);

  return store;
}
