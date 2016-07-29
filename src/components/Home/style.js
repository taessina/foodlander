import createStyleSheet from '../common/createStyleSheet';
import colors from '../common/color';

export default createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
    paddingTop: 24,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 24,
    margin: 8,
    padding: 24,
    paddingBottom: 8,
  },
  text: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 20,
  },
  subtext: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 16,
  },
  navContainer: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: colors.primaryColor,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    marginBottom: 8,
    marginTop: 24,
  },
});
