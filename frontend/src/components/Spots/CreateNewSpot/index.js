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
    <>
      <h1>Create new spot</h1>
      <form onSubmit={handleSubmit} className="CreateNewSpotForm">
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
        <label>
          Url:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>
        <button type="submit">create</button>
      </form>
    </>
  )
}
