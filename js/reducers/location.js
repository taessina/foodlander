const initialState = {
  name: null,
};

export default function location(state = initialState, action) {
  if (action.type === 'GET_LOCATION') {
    return {
      ...action,
      name: action.results[0].name,
    };
  }
  return state;
}
