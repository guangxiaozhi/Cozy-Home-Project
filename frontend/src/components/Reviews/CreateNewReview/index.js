import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {createOneReview} from '../../../store/reviewsReducer'
import './createReview.css'
export default function CreateNewReview(){
  const {spotId} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    console.log("spotId:::::::", spotId)
    const newReview = {
      review,
      stars
    };
    console.log("newReview",newReview)
    const updatedReview = await dispatch(createOneReview(newReview,spotId))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
      history.push(`/spots/${spotId}`)
  }
    return (
      <>
        <h2>Create new Review</h2>
        <form onSubmit={handleSubmit} className="create-review-container">
          <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <label>
            review:
            <input
              type="text"
              value={review}
              onChange={e => setReview(e.target.value)}
              required
            />
          </label>
          <label>
            stars:
            <input
              type="number"
              value={stars}
              onChange={e => setStars(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </>
    )
}
