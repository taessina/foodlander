import React from 'react';
import { StatusBar, View } from 'react-native';
import LocationMonitor from './components/common/LocationMonitor';
import colors from './components/common/color';
import Navigator from './Navigator';

export default function Main() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.statusBarColor} />
      <LocationMonitor />
      <Navigator />
    </View>
  );
}
