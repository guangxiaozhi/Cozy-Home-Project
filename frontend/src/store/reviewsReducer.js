import {csrfFetch} from './csrf';

const LOAD_ALL_REVIEWS_BY_SPOTID = 'reviews/LOAD_ALL_REVIEWS'
const  loadAllReviewsBySpotId = (reviews) => {
  return {
    type:LOAD_ALL_REVIEWS_BY_SPOTID,
    reviews
  }
}

export const fetchAllReviewsBySpotId = (spotId) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
  if(res.ok){
    const reviews = await res.json();
    dispatch(loadAllReviewsBySpotId(reviews["Reviews"]));
    return reviews;
  }
}

const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
const deleteReview = (reviewId) => {
  return {
    type:DELETE_REVIEW,
    reviewId
  }
}

export const deleteReviewById = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method:"DELETE"
  })
  if(res.ok){

    dispatch(deleteReview(reviewId))
  }
}

const initialState = {}

const reviewReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD_ALL_REVIEWS_BY_SPOTID:
      {const newState = {};
      const allReviews = action.reviews
      allReviews.forEach(review =>{
        newState[review["id"]] = review
      })
      return newState}
    case DELETE_REVIEW:
      {
        const newState = {...state}
        delete newState[action.reviewId]
      }
    default:
      return initialState;
  }
}
export default reviewReducer;
