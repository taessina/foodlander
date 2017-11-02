// @flow
import React from 'react';
import {
  Text,
  View,
  Modal,
} from 'react-native';
import AnimatedLogo from '../../components/AnimatedLogo';
import styles from './style';

type State = {
  modalVisible: boolean,
};

export default class Splashscreen extends React.Component<any, State> {
  state = {
    modalVisible: true,
  }

  goToNext() {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {}}
      >
        <View style={styles.loadingContainer}>
          <AnimatedLogo size={320} onEnd={() => this.goToNext()} />
          <Text style={styles.loadingText}>
            humbly solving the ultimate question in life
          </Text>
        </View>
      </Modal>
    );
  }
}
