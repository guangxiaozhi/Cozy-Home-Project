import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {createOneReview, fetchAllReviewsBySpotId} from '../../../store/reviewsReducer';
import {fetchOneSpot} from '../../../store/spotsReducer'
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

    const newReview = {
      review,
      stars
    };
    const updatedReview = await dispatch(createOneReview(newReview,spotId))
      .then(() => dispatch(fetchAllReviewsBySpotId(spotId)))
      .then(() => dispatch(fetchOneSpot(spotId)))
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
            <select onChange={e => setStars(e.target.value)}>
            <option>Choose 1-5</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          </label>

          <button type="submit">Submit</button>
        </form>
      </>
    )
}
