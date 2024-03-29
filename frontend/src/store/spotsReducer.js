import {csrfFetch} from './csrf';

// Get all spots
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

// get one spot details
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
export const loadOneSpot = (singlespot) =>{
  return {
    type:GET_SPOT_DETAILS,
    singlespot
  }
}

export const fetchOneSpot = (spotId) =>  async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  console.log("res.ok", res.ok)
  // alert(res.ok)
  if(res.ok){
    const specialSpot = await res.json();
    await dispatch(loadOneSpot(specialSpot));
    return specialSpot;
  }else{
    return 404
  }
}

// Create a new spot
const CREATE_NEW_SPOT = 'spots/CREATE_NEW_SPOT';
export const createNewSpot = (spot) =>{
  return {
    type:CREATE_NEW_SPOT,
    spot
  }
}

export const createOneSpot = (spot,spotImage) => async (dispatch) => {
  const res = await csrfFetch("/api/spots",{
    method:"POST",
    header:{"Content-Type":"application/json"},
    body:JSON.stringify(spot)
  })
  if(res.ok){
      const newSpot = await res.json();
      spotImage.spotId = newSpot.id;
      const spotImageRes = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method:"POST",
        header:{"Content-Type":"application/json"},
        body:JSON.stringify(spotImage)
      })
      if(spotImageRes.ok){
        const finalspot = await csrfFetch(`/api/spots/${newSpot.id}`)
        if(finalspot.ok){
          const newSpotWithImage = await finalspot.json();
          await dispatch(createNewSpot(newSpotWithImage));
          return newSpotWithImage;
        }
      }
    // }
  }
}

//Delete a spot
const DELETE_SPOT = 'spots/DELETE_SPOT';
export const deleteSpot = (spotId) =>{
  return {
    type:DELETE_SPOT,
    spotId
  }
}
export const deleteOneSpot = (spotId) => async (dispatch) =>{
  const res = await csrfFetch(`/api/spots/${spotId}`,{
    method:"DELETE"
  })
  if(res.ok){
    dispatch(deleteSpot(spotId))
  }

}

//Edit a spot
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const updateSpot = (spot) => {
  return {
    type:UPDATE_SPOT,
    spot
  }
}
export const updateOneSpot = (spot,spotId) =>async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`,{
    method:"PUT",
    header:{"Content-Type":"application/json"},
    body:JSON.stringify(spot)
  })
  if(res.ok){
    const newSpot = await res.json();
    dispatch(updateSpot(newSpot));
    return newSpot;
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
  const newState = {...state};
  switch (action.type) {
    case LOAD_ALL_SPOTS:
      newState.allSpots = normalize(action.spots)
      newState.singleSpot = {};
      return newState;

    case  GET_SPOT_DETAILS:
      newState.singleSpot = {...action.singlespot}
      return newState;

    case CREATE_NEW_SPOT:
      newState.allSpots = {...state.allSpots}
      const newSpot = action.spot;
      newState.allSpots[newSpot['id']] = newSpot;
      return newState;

    case DELETE_SPOT:
      delete newState.allSpots[action.spotId];
      newState.singleSpot = {};
      return newState

    case UPDATE_SPOT:
      newState.allSpots = {...state.allSpots}
      const updateSpot = action.spot;
      newState.allSpots[updateSpot['id']] = updateSpot;
      return newState

    default:
      return state;
  }
}

export default spotReducer;
