import React, { PropTypes } from 'react';
import {
  BackAndroid,
  NavigationExperimental,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import createStyleSheet from './common/createStyleSheet';
import { actionCreators as navActionCreators } from './ducks/navigation';
import Home from './containers/Home';
import Place from './containers/Place';

let styles = {};

class FLNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.handlers = [];
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => this.handleBackButton());
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', () => this.handleBackButton());
  }

  handleBackButton() {
    if (this.props.navigationState.index > 0) { // TODO: Check if we can go back
      this.props.dispatch(navActionCreators.doNavigatePop());
      return true;
    }

    return false;
  }

  renderScene(props) {
    const sceneState = props.scene.route;

    if (sceneState.key === 'index') {
      return <Home text={sceneState.key} />;
    }

    if (sceneState.key === 'place') {
      return <Place />;
    }
    return <Text>404</Text>;
  }

  render() {
    return (
      <NavigationExperimental.CardStack
        style={styles.container}
        renderScene={props => this.renderScene(props)}
        navigationState={this.props.navigationState}
        onNavigateBack={() => {
          this.props.dispatch(navActionCreators.doNavigatePop());
        }}
      />
    );
  }
}

FLNavigator.propTypes = {
  navigationState: PropTypes.object,
  dispatch: PropTypes.func,
};

styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#123456',
  },
});

function select(store) {
  return {
    navigationState: store.navigation,
  };
}

export default connect(select)(FLNavigator);
