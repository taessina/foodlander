import React from 'react';
import { Provider } from 'react-redux';

import Main from './Main';
import configureStore from './stores/configureStore';

export default class App extends React.Component {
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

/* eslint-disable */
console.disableYellowBox = true; // Temporarily disable warnings from NavigationExperimental
