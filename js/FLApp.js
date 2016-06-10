import React from 'react';
import { View } from 'react-native';
import FLNavigator from './FLNavigator';

export default function FLApp() {
  return (
    <View style={{ flex: 1 }}>
      <FLNavigator />
    </View>
  );
}
