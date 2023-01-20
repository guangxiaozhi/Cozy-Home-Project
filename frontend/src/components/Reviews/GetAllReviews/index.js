import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { fetchAllReviewsBySpotId ,deleteReviewById} from "../../../store/reviewsReducer"

export default function GetAllReviews({spotId, allReviews}){
console.log("getallReviews component spotId:", spotId)
  const dispatch = useDispatch();
  const history = useHistory();

  const sessionUser = useSelector(state => state.session.user)
  const currentSpot = useSelector(state => state.spots.singleSpot)

  // const allReviews = useSelector(state => state.reviews)
  const reviews = Object.values(allReviews);
  console.log("reviews from useSelector", reviews)
  let userReview = null;
  let isOwnedBySessionUser = false;
  if(sessionUser){
    userReview = reviews.filter(review => review.userId === sessionUser.id)
    isOwnedBySessionUser = sessionUser.id === currentSpot.Owner.id
  }

  // useEffect(() => {
  //   dispatch(fetchAllReviewsBySpotId(spotId))
  // },[dispatch])

  const handleDelete = (reviewId) => async (e) => {
    await dispatch(deleteReviewById(reviewId))
  }

  // if(!reviews.length) return null;


  return (
    <div>
    <h2>Reviews</h2>

    {reviews.map(review => (
      <div key={review.id}>
        {/* <div>user:{review.User.firstName}</div> */}
        <div>Time: {review.updatedAt}</div>
        <div>Review: {review.review}</div>
        {sessionUser && review.userId === sessionUser.id?<button onClick={handleDelete(review.id)}>Delete Review</button>: ""}
      </div>
    ))}

    {sessionUser && !isOwnedBySessionUser && !userReview.length && <NavLink to={`/spots/${spotId}/reviews`}>Create New Review</NavLink>}
    </div>
  )
}
