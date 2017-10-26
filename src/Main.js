import React from 'react';
import { StatusBar, View } from 'react-native';
import LocationMonitor from './components/common/LocationMonitor';
import colors from './components/common/color';
<<<<<<< HEAD
import ReactNavigator from './Navigator';
=======
import ReactNavigator from './ReactNavigator';
>>>>>>> c6a10304c5cf51548bd5308397e5b99ee33ec189

export default function Main() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.statusBarColor} />
      <LocationMonitor />
      <ReactNavigator />
    </View>
  );
}
