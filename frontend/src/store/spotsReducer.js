import {csrfFetch} from './csrf';


// action creators
const LOAD_ALL_SPOTS = 'spots/LOAD_ALL_SPOTS';
export const loadAllSpots = (spots) => {
  return {
    type:LOAD_ALL_SPOTS,
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

const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
export const loadOneSpot = (singlespot) =>{
  return {
    type:GET_SPOT_DETAILS,
    singlespot
  }
}

export const fetchOneSpot = (spotId) =>  async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if(res.ok){
    const specialSpot = await res.json();
    await dispatch(loadOneSpot(specialSpot));
    return specialSpot;
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
  let newState = {...state};
  switch (action.type) {
    case LOAD_ALL_SPOTS:
      newState.allSpots = normalize(action.spots)
      return newState;

    case  GET_SPOT_DETAILS:

        newState.singleSpot = {...action.singlespot}
        return newState;

    default:
      return state;
  }
}

export default spotReducer;
