import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { push } from '../actions/navigation';

class Home extends React.Component {
  render() {
    return (
      <TouchableNativeFeedback
        style={{ flex: 1 }}
        onPress={() => this.props.push({ key: `index${Math.random()}` })}
      >
        <View style={{ flex: 1 }}>
          <Text>{this.props.text}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

Home.propTypes = {
  text: PropTypes.string,
  push: PropTypes.func,
};

export default connect(null, { push })(Home);
