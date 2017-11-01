// @flow
import { StyleSheet } from 'react-native';
import colors from '../../themes/color';

export default StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    paddingTop: 32,
  },
  loadingText: {
    color: colors.loadingTextColor,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
  },
});
