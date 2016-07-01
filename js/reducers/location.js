const initialState = {
  name: null,
};

export default function location(state = initialState, action) {
  if (action.type === 'GET_LOCATION') {
    const index = Math.floor(Math.random() * 10);
    return {
      ...action,
      name: action.results[index].name,
      lat: action.results[index].geometry.location.lat,
      lng: action.results[index].geometry.location.lng,
    };
  }
  return state;
}
