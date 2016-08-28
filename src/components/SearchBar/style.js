import createStyleSheet from '../common/createStyleSheet';

export default createStyleSheet({
  card: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 2,
    margin: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 16,
    paddingRight: 36,
  },
  areaText: {
    fontSize: 20,
    fontFamily: 'sans-serif-medium',
  },
});
