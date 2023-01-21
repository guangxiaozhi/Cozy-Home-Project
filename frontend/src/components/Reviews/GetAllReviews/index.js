import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { fetchAllReviewsBySpotId ,deleteReviewById} from "../../../store/reviewsReducer"
import './getAllReviews.css'

export default function GetAllReviews({spotId}){
  const dispatch = useDispatch();
  const history = useHistory();

  const sessionUser = useSelector(state => state.session.user)
  // const currentSpot = useSelector(state => state.spots.singleSpot)

  const allReviews = useSelector(state => state.reviews)
  useEffect(() => {
    dispatch(fetchAllReviewsBySpotId(spotId))
  },[dispatch])
  const reviews = Object.values(allReviews);
  let userReview = null;
  // let isOwnedBySessionUser = false;
  if(sessionUser){
    userReview = reviews.filter(review => review.userId === sessionUser.id)
    // isOwnedBySessionUser = sessionUser.id === currentSpot.Owner.id
  }


  const handleDelete = (reviewId) => async (e) => {
    await dispatch(deleteReviewById(reviewId))
  }

  const options = { year: 'numeric', month: 'long' };

  return (
    <div className="reviews-container">
    <h2>Reviews</h2>

    {reviews.map(review => (

      <div className="single-review" key={review.id}>
        <div className="review-user-data">
          <div>user: {review.User.firstName}</div>
          <div>Time: {new Date(review.updatedAt).toLocaleDateString("en-US", options)}</div>
        </div>
        <div>Review: {review.review}</div>
        {sessionUser && review.userId === sessionUser.id?<button className="delete-review" onClick={handleDelete(review.id)}>Delete Review</button>: ""}
      </div>

    ))}
    {/* {sessionUser && !isOwnedBySessionUser && !userReview.length && <NavLink to={`/spots/${spotId}/reviews`}>Create New Review</NavLink>} */}

    {sessionUser && !userReview.length && <NavLink className="create-new-review" to={`/spots/${spotId}/reviews`}>Create New Review</NavLink>}
    </div>
  )
}
