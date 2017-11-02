// @flow
import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, type NavigationState } from 'react-navigation';
import Home from './containers/Home';

export const Navigator = StackNavigator({
  Home: { screen: Home },
}, { headerMode: 'none' });

type Props = { dispatch: Function, nav: NavigationState };

const NavigatorWithState = (props: Props) => (
  <Navigator navigation={addNavigationHelpers({
    dispatch: props.dispatch,
    state: props.nav,
  })}
  />
);

const mapStateToProps = state => ({ nav: state.nav });

export default connect(mapStateToProps)(NavigatorWithState);
