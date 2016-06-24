import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
} from 'react-native';
import createStyleSheet from '../common/createStyleSheet';
import { push } from '../actions';
import MapView from 'react-native-maps';


class Place extends React.Component {
  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
    );
  }
}

Place.propTypes = {
  text: PropTypes.string,
  push: PropTypes.func,
};

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    height: 150,
    width: 150,
    alignItems: 'center',
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
    flex: 1,
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: 300,
  },
});

export default connect((state) => ({
  name: state.location.name,
}), { push })(Place);
