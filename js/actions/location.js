import { actionCreators as navActionCreators } from '../ducks/navigation';

const API_BASE = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=500&types=food&name=cruise&key=AIzaSyBBCaIC1xyjWjuDuKbjBhPFahpQk7yzQhU';

export const location = () => {
  return (dispatch) => {
    return fetch(`${API_BASE}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    }).then((response) => response.json()).then((json) => {
      dispatch({
        ...json,
        type: 'GET_LOCATION',
      });
      dispatch(navActionCreators.doNavigatePush({ key: 'place' }));
    });
  };
};
