import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators as placeActionCreators } from '../../ducks/place';
import Home from './presenter';

function mapDispatchToProps(dispatch) {
  return {
    doGetRandomPlace: bindActionCreators(placeActionCreators.doGetRandomPlace, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(Home);
