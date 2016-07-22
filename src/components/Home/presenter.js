import React, { PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import Touchable from '../common/F8Touchable';
import colors from '../common/color';
import styles from './style';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  handleBtnPress() {
    // this.setState({ loading: true });
    this.props.doGetRandomPlace({
      latitude: this.props.latitude,
      longitude: this.props.longitude,
    });
    // this.setState({ loading: false });
  }

  render() {
    if (!this.props.latitude && !this.props.longitude) {
      return (
        <View style={styles.container}>
          <Spinner color={colors.accentColor} type="Bounce" size={80} />
          <Text style={styles.loadingText}>Searching for nearby restaurants</Text>
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
