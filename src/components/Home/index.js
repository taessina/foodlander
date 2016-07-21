import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../ducks/place';
import Home from './presenter';

function mapStateToProps(state) {
  const { coordinate } = state.location;
  return {
    latitude: coordinate ? coordinate.latitude : 0.0,
    longitude: coordinate ? coordinate.longitude : 0.0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    doGetRandomPlace: bindActionCreators(placeActionCreators.doGetRandomPlace, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
