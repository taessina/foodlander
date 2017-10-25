import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import LocationMonitor from './components/common/LocationMonitor';
import colors from './components/common/color';
import ReactNavigator from './ducks/ReactNavigator';

export default function Main() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.statusBarColor} />
      <LocationMonitor />
      <ReactNavigator />
    </View>
  );
}
