import { connect } from 'react-redux';
import Place from './presenter';

function mapStateToProps(state) {
  const { selectedPlace } = state.place;
  const { name, latitude, longitude, latitudeDelta, longitudeDelta } = selectedPlace;
  return {
    name,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta };
}

export default connect(mapStateToProps)(Place);
