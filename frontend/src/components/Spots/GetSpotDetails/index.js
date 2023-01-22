import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory,  useParams} from 'react-router-dom';
import {fetchOneSpot, deleteOneSpot} from '../../../store/spotsReducer';
import GetAllReviews from '../../Reviews/GetAllReviews';
import './singleSpotPage.css'


export default function GetSpotDetails(){
  const dispatch = useDispatch();
  const history = useHistory();

  const {spotId} = useParams();
  const spot = useSelector(state => state.spots.singleSpot)
  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchOneSpot(+spotId));
  }, [dispatch]);

  const handleEdit = (e) => {
    history.push(`/spots/${spotId}/edit`)
  }

  const handleDelete =  (e) => {
    dispatch(deleteOneSpot(spotId))
    history.push('/')
  }
  return (
    <div className='single-spot-container'>
      {spot && spot.SpotImages && (
        <div>

          <div>
            <h2 className='header'>{spot.name}</h2>
            <div className='single-spot-information-container'>
              <div >
                <span className='address'>★ {spot.avgStarRating ? Number(spot.avgStarRating).toFixed(2):"new"} </span>
                <span className='address'>{spot.numReviews} reviews</span>
                <span className='address'> {spot.city}, {spot.state}, {spot.country}</span>
              </div>
              {sessionUser && sessionUser.id === spot.ownerId && (
                <div className='Edit-delete-container'>
                  <button className='button' onClick={handleEdit}>Edit</button>
                  <button className='button' onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          </div>
          <div>
            <img className='detail-image' style={{ height: "450px",width: "500px"}} src={spot.SpotImages[0].url} />
          </div>
          <div className='hard-code'>
                <h2>Entire home hosted by Fieldtrip</h2>
                <p>8 guests4 bedrooms4 beds5 baths</p>
                <hr></hr>
                <h3>Fieldtrip is a Superhost</h3>
                <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
          </div>
          <hr></hr>
          <div className='reviews'>
            {/* <GetAllReviews spotId={spotId} allReviews={allReviews}/> */}
            <GetAllReviews spotId={spotId}/>
          </div>
        </div>
      )}
    </div>

  )
}