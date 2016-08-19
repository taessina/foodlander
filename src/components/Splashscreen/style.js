import createStyleSheet from '../common/createStyleSheet';
import colors from '../common/color';

export default createStyleSheet({
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
