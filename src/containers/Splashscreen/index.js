// @flow
import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import AnimatedLogo from '../../components/AnimatedLogo';
import styles from './style';

export default function Splashscreen() {
  return (
    <View style={styles.loadingContainer}>
      <AnimatedLogo size={320} />
      <Text style={styles.loadingText}>
        humbly solving the ultimate question in life
      </Text>
    </View>
  );
}
