import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import {NavLink} from 'react-router-dom'
import CreateNewReview from '../CreateNewReview'
import { fetchAllReviewsBySpotId ,deleteReviewById} from "../../../store/reviewsReducer"

export default function GetAllReviews({spotId}){
  const dispatch = useDispatch();

  const allReviews = useSelector(state => state.reviews)
  const sessionUser = useSelector(state => state.session.user)
  const reviews = Object.values(allReviews);

  const userReview = reviews.filter(review => review.userId === sessionUser.id)
  console.log("current user's review:", userReview)
  useEffect(() => {
    dispatch(fetchAllReviewsBySpotId(spotId))
  },[dispatch])

  const handleDelete = (reviewId) => async (e) => {
    await dispatch(deleteReviewById(reviewId))
  }

  // if(!reviews.length) return null;


  return (
    <>
    <h2>Reviews</h2>

    {!userReview.length &&  <NavLink to="/spots/:spotId/reviews">create new review</NavLink>}


    {reviews.map(review => (
      <div key={review.id}>
        <div>User: {review.User.firstName} </div>
        <div>Time: {review.updatedAt}</div>
        <div>Review: {review.review}</div>
        {sessionUser && review.userId === sessionUser.id?<button onClick={handleDelete(review.id)}>Delete Review</button>: ""}
      </div>
    ))}
    </>
  )
}
