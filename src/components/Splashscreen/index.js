import { connect } from 'react-redux';
import { actionCreators as navActionCreators } from '../../ducks/navigation';
import Splashscreen from './presenter';

function mapDispatchToProps(dispatch) {
  return {
    onEnd: () => dispatch(navActionCreators.doReplace('splashscreen', { key: 'index' })),
  };
}

export default connect(null, mapDispatchToProps)(Splashscreen);
