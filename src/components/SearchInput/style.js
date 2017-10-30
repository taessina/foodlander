// @flow
import { StyleSheet } from 'react-native';
import colors from '../../themes/color';

export default StyleSheet.create({
  card: {
    height: 48,
    backgroundColor: '#FFF',
    borderRadius: 2,
    margin: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    paddingLeft: 16,
    paddingRight: 36,
  },
  placeIcon: {
    paddingRight: 16,
  },
  areaText: {
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
  },
  suggestions: {
    backgroundColor: '#FFF',
    borderRadius: 2,
    marginHorizontal: 8,
    elevation: 2,
  },
  suggestion: {
    height: 56,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dividerColor,
  },
  mainText: {
    fontWeight: 'bold',
  },
});
