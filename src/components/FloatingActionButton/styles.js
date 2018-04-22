import { StyleSheet } from 'react-native';
import colors from '../../themes/color';

export default StyleSheet.create({
  default: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    margin: 0,
    justifyContent: 'flex-end',
  },
  pushed: {
    position: 'absolute',
    bottom: 216,
    left: 0,
    right: 0,
    margin: 0,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  upPillContainer: {
    height: 30,
    width: 30,
    borderWidth: 2,
    borderColor: colors.accentColor,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  downPillContainer: {
    height: 30,
    width: 30,
    borderWidth: 2,
    borderColor: colors.accentColor,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  button: {
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  left: {
    alignItems: 'flex-start',
    marginLeft: 30,
  },
  right: {
    alignItems: 'flex-end',
    marginRight: 16,
    marginBottom: 50,
  },
  topRight: {
    alignItems: 'flex-end',
    marginRight: 16,
    marginBottom: 145,
  },
  bottomRight: {
    alignItems: 'flex-end',
    marginRight: 16,
    marginBottom: 115,
  },
});
