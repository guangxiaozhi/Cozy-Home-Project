import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { fetchAllReviewsBySpotId ,deleteReviewById} from "../../../store/reviewsReducer"

export default function GetAllReviews({spotId}){
console.log("getallReviews component spotId:", spotId)
  const dispatch = useDispatch();
  const history = useHistory();

  const allReviews = useSelector(state => state.reviews)
  const sessionUser = useSelector(state => state.session.user)
  const currentSpot = useSelector(state => state.spots.singleSpot)
  const reviews = Object.values(allReviews);

  let userReview = null;
  let isOwnedBySessionUser = false;
  if(sessionUser){
    userReview = reviews.filter(review => review.userId === sessionUser.id)
    console.log("userReview", userReview)
    isOwnedBySessionUser = sessionUser.id === currentSpot.Owner.id
  }

  useEffect(() => {
    dispatch(fetchAllReviewsBySpotId(spotId))
  },[dispatch])

  const handleDelete = (reviewId) => async (e) => {
    await dispatch(deleteReviewById(reviewId))
  }


  return (
    <div>
    <h2>Reviews</h2>

    {reviews.map(review => (
      <div key={review.id}>
        {/* <div>User: {currentSpot.Owner.firstName} </div> */}
        <div>userId:{review.userId}</div>
        <div>Time: {review.updatedAt}</div>
        <div>Review: {review.review}</div>
        {sessionUser && review.userId === sessionUser.id?<button onClick={handleDelete(review.id)}>Delete Review</button>: ""}
      </div>
    ))}

    {sessionUser && !isOwnedBySessionUser && !userReview.length && <NavLink to={`/spots/${spotId}/reviews`}>Create New Review</NavLink>}
    </div>
  )
}
