import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
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
  button: {
    height: 56,
    width: 56,
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
    marginRight: 30,
  },
});
