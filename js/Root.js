import React from 'react';
import { Provider } from 'react-redux';

import FLApp from './FLApp';
import configureStore from './store/configureStore';

export default class Root extends React.Component {
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
        <FLApp />
      </Provider>
    );
  }
}

/* eslint-disable */
console.disableYellowBox = true; // Temporarily disable warnings from NavigationExperimental
