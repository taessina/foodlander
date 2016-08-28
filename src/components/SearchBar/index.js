import { connect } from 'react-redux';
import SearchBar from './presenter';

function mapStateToProps(state) {
  const { area } = state.location;
  const { area: { keyword } } = state.place;
  return {
    area,
    keyword,
  };
}

export default connect(mapStateToProps)(SearchBar);
