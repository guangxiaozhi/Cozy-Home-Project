import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, Link, useParams, Redirect} from 'react-router-dom';
import {fetchOneSpot} from '../../../store/spotsReducer';

export default function GetSpotDetails(){
  const dispatch = useDispatch();

  const {spotId} = useParams();
  const spot = useSelector(state =>  Object.values(state.spots.allSpots)[spotId - 1])

  useEffect(() => {
    dispatch(fetchOneSpot(+spotId));
}, [dispatch]);


  return (
    <div>
      {spot && (
        <div>
          <div>
            <h1>{spot.name}</h1>
            <div>
              <div>
                <span>avgRating: ({spot.avgRating}) </span>
                <span>{spot.city},{spot.state}, {spot.country}</span>
              </div>
            </div>
          </div>
          <div>
            <img style={{ height: "400px",width: "400px"}} src={spot.previewImage} />
          </div>
        </div>
      )}
    </div>
  )
}
