import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import codePush from 'react-native-code-push';

import Main from './Main';
import configureStore from './stores/configureStore';
<<<<<<< HEAD
import Splashscreen from './components/Splashscreen';
=======
import Splashscreen from './components/Splashscreen/presenter';
>>>>>>> c6a10304c5cf51548bd5308397e5b99ee33ec189

const { persistedStore, store } = configureStore();

const App = () => (
  <Provider store={store}>
    <PersistGate
      persistor={persistedStore}
      loading={<Splashscreen />}
    >
      <Main />
    </PersistGate>
  </Provider>
);

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: true,
})(App);
