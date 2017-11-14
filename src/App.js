// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import NavigatorWithState from './Navigator';
import createStore from './redux/createStore';
import LocationMonitor from './components/LocationMonitor';

const { persistor, store } = createStore();

const App = () => (
  <Provider store={store}>
    <PersistGate
      loading={null}
      persistor={persistor}
    >
      <LocationMonitor />
      <NavigatorWithState />
    </PersistGate>
  </Provider>
);

export default App;
