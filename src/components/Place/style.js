import createStyleSheet from '../common/createStyleSheet';

export default createStyleSheet({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 2,
    elevation: 2,
    margin: 8,
    padding: 16,
  },
  text: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 20,
    fontWeight: '500',
  },
  subtext: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 16,
    paddingRight: 16,
  },
  button: {
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37474f',
    borderRadius: 28,
    elevation: 6,
  },
});
