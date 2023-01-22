import { useState } from "react";
import { useDispatch } from "react-redux";
import {useHistory} from 'react-router-dom';
import { createOneSpot } from '../../../store/spotsReducer';
import './createNewSpot.css';

export default function CreateNewSpot(){

  const dispatch = useDispatch();
  const history = useHistory();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state,setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(1232);
  const [lng, setLng] = useState(54);
  const [name, setName] = useState("");
  const [description, setDeacription] = useState("");
  const [price, setPrice] = useState();
  const [url, setUrl] = useState();
  const [preview, setPreview] = useState(true);
  const [errors, setErrors] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const spot = {
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
    const spotImage = {
      url,
      preview
    }
    const newSpot = await dispatch(createOneSpot(spot,spotImage))
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
    history.push(`/spots/${newSpot["id"]}`)
  }

  return (
    <div className="create-spot-container">
      <h1>Create new spot</h1>
      <form onSubmit={handleSubmit} className="CreateNewSpotForm">
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
          <input
            className="create-spot-information"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDeacription(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="number"
            placeholder="Price per night"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            className="create-spot-information"
            type="text"
            placeholder="Image"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        <button className="create-spot-button" type="submit">create</button>
      </form>
    </div>
  )
}
