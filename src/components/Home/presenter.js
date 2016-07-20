import React, { PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Touchable from '../common/F8Touchable';
import styles from './style';

class Home extends React.Component {
  handleBtnPress() {
    this.props.doGetRandomPlace({
      latitude: 3.139055,
      longitude: 101.6144002,
    });
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
  doGetRandomPlace: PropTypes.func,
};

export default Home;
