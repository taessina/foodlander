import React, { PropTypes } from 'react';
import {
  BackAndroid,
  NavigationExperimental,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import createStyleSheet from './common/createStyleSheet';
import { back } from './actions/navigation';
import Home from './containers/Home';

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
      this.props.back();
      return true;
    }

    return false;
  }

  renderScene(props) {
    const sceneState = props.scene.navigationState;

    if (sceneState.key.indexOf('index') !== -1) {
      return <Home text={sceneState.key} />;
    }
    return <Text>404</Text>;
  }

  render() {
    return (
      <NavigationExperimental.CardStack
        style={styles.container}
        renderScene={props => this.renderScene(props)}
        navigationState={this.props.navigationState}
        onNavigate={(action) => {
          if (action.type === 'back') {
            this.props.back();
          }
        }}
      />
    );
  }
}

FLNavigator.propTypes = {
  navigationState: PropTypes.object,
  back: PropTypes.func,
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

export default connect(select, { back })(FLNavigator);
