import {csrfFetch} from './csrf';

const LOAD_ALLSPOTS = 'spots/LOAD_ALLSPOTS';

// action creators
export const loadAllSpots = (spots) => {
  return {
    type:LOAD_ALLSPOTS,
    spots
  }
}

// thunk action creators
export const fetchAllSpots = () =>  async (dispatch) => {
  const res = await csrfFetch("api/spots?page=1&size=20");
  if(res.ok){
    const allSpots = await res.json();
    await dispatch(loadAllSpots(allSpots));
    return allSpots;
  }
}

const normalize = (spots) => {
  const spotDate = {};
  spots.Spots.forEach(spot => spotDate[spot.id] = spot);
  return spotDate;
}

const initialState = {
  allSpots: {},
  singleSpot: {}
}

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALLSPOTS:
      const newState = {...state};
      newState.allSpots = normalize(action.spots)
      return newState;
    default:
      return state;
  }
}

export default spotReducer;
