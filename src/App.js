import React from 'react';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';

import Main from './Main';
import configureStore from './stores/configureStore';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      store: configureStore(() => this.setState({ isLoading: false })),
    };
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }
    return (
      <Provider store={this.state.store}>
        <Main />
      </Provider>
    );
  }
}

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: true,
})(App);

/* eslint-disable */
console.disableYellowBox = true; // Temporarily disable warnings from NavigationExperimental
