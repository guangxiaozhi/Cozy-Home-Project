import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {fetchAllSpots} from '../../../store/spotsReducer';
import './allSpots.css'

export default function GetAllSpots(){
  const dispatch = useDispatch();
  const history = useHistory();
  const allSpots = useSelector(state => Object.values(state.spots.allSpots))

  useEffect(() => {
    dispatch(fetchAllSpots());
    }, [dispatch]);

  const handleClick = (spotId) => {
    history.push(`/spots/${spotId}`)
  }
  return (
    <div>
      {allSpots && (
        allSpots.map(spot => (
          <div key={spot.id}>
            <div>
              <img style={{ height: "400px",width: "400px"}} src={spot.previewImage} onClick={() => handleClick(spot.id)}></img>
            </div>
            <div>
              <div>
                <p>{spot.city}</p>
                <p>{spot.state}</p>
                <p>{spot.price}</p>
              </div>
              <p>avgRating:<span>( </span>{spot.avgRating?spot.avgRating:"new"}<span>)</span></p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
