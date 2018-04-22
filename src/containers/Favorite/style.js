// @flow
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  favContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  favMainBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 260,
    backgroundColor: '#FFFFFF',
  },
  itemBox: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
  },
  titleBox: {
    flex: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  countBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
    marginLeft: 20,
  },
  headerBox: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 15,
    marginLeft: 20,
    marginTop: 13,
  },
  buttonBox: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButtonStyle: {
    width: '15%',
    height: '50%',
    marginRight: 20,
    marginTop: 15,
  },
  buttonTextStyle: {
    textAlign: 'center',
    fontSize: 15,
  },
});
