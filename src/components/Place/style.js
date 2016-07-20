import createStyleSheet from '../common/createStyleSheet';

export default createStyleSheet({
  textContainer: {
    flex: 1,
    height: 60,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
  },
  button: {
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37474f',
    borderRadius: 20,
    margin: 16,
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
