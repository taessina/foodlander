import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import AnimatedLogo from '../common/AnimatedLogo';
import styles from './style';

function Splashscreen(props) {
  return (
    <View style={styles.loadingContainer}>
      <AnimatedLogo size={320} onEnd={props.onEnd} />
      <Text style={styles.loadingText}>
        humbly solving the ultimate question in life
      </Text>
    </View>
  );
}

Splashscreen.propTypes = {
  onEnd: React.PropTypes.func,
};

export default Splashscreen;
