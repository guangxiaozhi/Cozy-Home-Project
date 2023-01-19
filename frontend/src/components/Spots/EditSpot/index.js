import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useHistory, useParams} from 'react-router-dom';
import { updateOneSpot } from "../../../store/spotsReducer";
export default function EditSpot(){
  const {spotId} = useParams();
  const spot = useSelector(state => state.spots.allSpots[spotId])
  const dispatch = useDispatch();
  const history = useHistory();

  const [address, setAddress] = useState(spot.address);
  const [city, setCity] = useState(spot.city);
  const [state,setState] = useState(spot.state);
  const [country, setCountry] = useState(spot.country);
  const [lat, setLat] = useState(1232);
  const [lng, setLng] = useState(54);
  const [name, setName] = useState(spot.name);
  const [description, setDeacription] = useState(spot.description);
  const [price, setPrice] = useState(spot.price);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const updateSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    };
    const newSpot = await dispatch(updateOneSpot(updateSpot,spotId))
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
    history.push(`/spots/${newSpot["id"]}`)
  }

  return (
    <div>
      <h1>Edit Spot</h1>
      <form onSubmit={handleSubmit}  className="CreateNewSpotForm">
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State:
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDeacription(e.target.value)}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button type="submit">Edit</button>
      </form>
    </div>
  )
}
