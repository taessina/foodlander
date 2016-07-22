import createStyleSheet from '../common/createStyleSheet';
import colors from '../common/color';

export default createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.accentColor,
    fontWeight: '500',
    marginTop: 16,
  },
  button: {
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37474f',
    borderRadius: 150,
    margin: 16,
    padding: 8,
    elevation: 2,
    shadowColor: 'grey',
    shadowRadius: 2,
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
