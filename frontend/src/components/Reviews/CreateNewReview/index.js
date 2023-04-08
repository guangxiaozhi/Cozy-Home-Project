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
  const [stars, setStars] = useState("3");
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
      <div  className="create-review-container">
        <h2>Create new Review</h2>
        <form onSubmit={handleSubmit} className="create-new-review-form">
          <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <label>
            <span>review:</span>
            <input
              type="text"
              value={review}
              onChange={e => setReview(e.target.value)}
              required
            />
          </label>
          <label>
          <span>stars:</span>
            <select onChange={e => setStars(e.target.value)} value={stars}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    )
}
