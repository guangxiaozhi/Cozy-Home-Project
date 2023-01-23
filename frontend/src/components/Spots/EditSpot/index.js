import { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {useHistory, useParams} from 'react-router-dom';
import { updateOneSpot, fetchOneSpot } from "../../../store/spotsReducer";

import './EditSpot.css'

export default function EditSpot(){
  const {spotId} = useParams();
  const spot = useSelector(state => state.spots.singleSpot)
  // console.log("spots", spots)
  // const spot=spots[singleSpot]
  const dispatch = useDispatch();
  const history = useHistory();

  // const [address, setAddress] = useState(spot?.address);
  // const [city, setCity] = useState(spot?.city);
  // const [state,setState] = useState(spot?.state);
  // const [country, setCountry] = useState(spot?.country);
  // const [lat, setLat] = useState(1232);
  // const [lng, setLng] = useState(54);
  // const [name, setName] = useState(spot?.name);
  // const [description, setDeacription] = useState(spot?.description);
  // const [price, setPrice] = useState(spot?.price);
  // const [errors, setErrors] = useState([]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(10);
  const [lng, setLng] = useState(10);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState([]);
  // const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect( () => {
    if (spot) fillFields()
}, [spot]);

useEffect( () => {
  dispatch(fetchOneSpot(spotId));

}, [dispatch. spotId]);



const fillFields = () => {
    setName(spot.name)
    setAddress(spot.address)
    setCity(spot.city)
    setState(spot.state)
    setCountry(spot.country)
    setPrice(spot.price)
    setDescription(spot.description)
}


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
    console.log("does it dispatch successful?")
    history.push(`/spots/${spotId}`)
  }

  return (
    <div className="edit-spot-container">
      <h1 >Edit Spot</h1>
      <form onSubmit={handleSubmit}  className="edit-new-spot-form">
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          <span>Address:</span>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          <span>City:</span>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          <span>State:</span>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Country:</span>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Name:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Description:</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Price:</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <button className="edit-spot-button" type="submit">Edit</button>
      </form>



    </div>
  )
}
