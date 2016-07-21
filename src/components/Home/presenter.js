import React, { PropTypes } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import Touchable from '../common/F8Touchable';
import styles from './style';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  handleBtnPress() {
    this.setState({ loading: true });
    this.props.doGetRandomPlace({
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator />
          <Text>Searching for food nearby</Text>
        </View>
      );
    }

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
  latitude: PropTypes.number,
  longitude: PropTypes.number,
};

export default Home;
