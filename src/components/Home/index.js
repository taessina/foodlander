import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
} from 'react-native';
import Touchable from '../common/F8Touchable';
import createStyleSheet from '../common/createStyleSheet';
import { actionCreators as placeActionCreators } from '../../ducks/place';

class Home extends React.Component {
  handleBtnPress() {
    this.props.dispatch(placeActionCreators.doGetRandomPlace({
      latitude: 3.139055,
      longitude: 101.6144002,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Touchable
          onPress={() => this.handleBtnPress()}
        >
          <View
            style={styles.button}
          >
            <Text style={styles.buttonText}>GO</Text>
          </View>
        </Touchable>
      </View>
    );
  }
}

Home.propTypes = {
  text: PropTypes.string,
  dispatch: PropTypes.func,
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37474f',
    borderRadius: 150,
    margin: 16,
    padding: 8,
    elevation: 2,
    shadowColor: 'grey',
    shadowRadius: 2,
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default connect()(Home);
