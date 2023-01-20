import {csrfFetch} from './csrf';

// load all reviews by spotId
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

// delete review
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

// create new review
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const createReview = (review) => {
  return {
    type:CREATE_REVIEW,
    review
  }
}
export const createOneReview = (newReview,spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body:JSON.stringify(newReview)
  })
  console.log(res)
  if(res.ok){
    const review = await res.json();
    dispatch(createReview(review));
    return review;
  }
}

const initialState = {}

const reviewReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case LOAD_ALL_REVIEWS_BY_SPOTID:
        newState = {};
        const allReviews = action.reviews
        allReviews.forEach(review =>{
          newState[review["id"]] = review
        })
        return newState

    case DELETE_REVIEW:
        newState = {...state}
        delete newState[action.reviewId]
        return newState

    case CREATE_REVIEW:
        newState = {...state}
        newState[action.review.id] = action.review;
        return newState;

    default:
      return state;
  }
}
export default reviewReducer;
