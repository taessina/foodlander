import React from 'react';
import { View } from 'react-native';
import Navigator from './Navigator';
import LocationMonitor from './components/common/LocationMonitor';

export default function Main() {
  return (
    <View style={{ flex: 1 }}>
      <LocationMonitor />
      <Navigator />
    </View>
  );
}
