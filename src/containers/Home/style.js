// @flow
import { StyleSheet } from 'react-native';
import colors from '../../themes/color';

export default StyleSheet.create({
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
    marginTop: 0,
    padding: 24,
    paddingBottom: 8,
  },
  textContainerWithoutAction: {
    paddingBottom: 32,
  },
  text: {
    color: colors.primaryText,
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 20,
  },
  subtext: {
    color: colors.secondaryText,
    fontSize: 16,
  },
  navContainer: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
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
  rating: {
    flexDirection: 'row',
    paddingTop: 8,
    alignItems: 'center',
  },
  loading: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    margin: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  resContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resMainBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 350,
    height: 500,
    backgroundColor: 'rgba(204,238,255,0.8)',
  },
  resColBox: {
    flex: 0.80,
    flexDirection: 'column',
    alignItems: 'center',
  },
  resRowBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 130,
    height: 130,
    margin: 5,
  },
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
  areaTextContainer: {
    position: 'absolute', bottom: 16, left: 16, justifyContent: 'flex-end', marginBottom: 50,
  },
  areaText: {
    fontSize: 30,
    color: 'rgba(150,150,150,0.8)',
  },
});
