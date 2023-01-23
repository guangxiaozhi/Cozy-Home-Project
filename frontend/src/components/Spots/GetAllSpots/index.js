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
    <div className="spots-container">
      {allSpots && (
        allSpots.map(spot => (
          <div key={spot.id} className='spot'>
            <div >
              <img className='spot-image'  src={spot.previewImage} onClick={() => handleClick(spot.id)}></img>
            </div>
            <div className='spot-information'>
              <div >
                <div className='city-state'>
                  <p className='information'><b>{spot.city}</b></p>
                  <p className='information'><b>{spot.state}</b></p>
                </div>
                <p className='price'><b>${spot.price }</b>   night</p>
              </div>
              <div className='avegRating'>★{spot.avgRating?Number(spot.avgRating).toFixed(2):"new"}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
