import { connect } from 'react-redux';
import Place from './presenter';

function mapStateToProps(state) {
  const { selectedPlace } = state.place;
  const { name, latitude, longitude, latitudeDelta, longitudeDelta, vicinity } = selectedPlace;
  return {
    name,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
    vicinity,
  };
}

export default connect(mapStateToProps)(Place);
