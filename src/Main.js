import React from 'react';
import { StatusBar, View } from 'react-native';
import Navigator from './Navigator';
import LocationMonitor from './components/common/LocationMonitor';
import colors from './components/common/color';

export default function Main() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.statusBarColor} translucent />
      <LocationMonitor />
      <Navigator />
    </View>
  );
}
