import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory, Link, useParams, Redirect} from 'react-router-dom';
import {fetchOneSpot, deleteOneSpot} from '../../../store/spotsReducer';


export default function GetSpotDetails(){
  const dispatch = useDispatch();
  const history = useHistory();

  const {spotId} = useParams();
  const spot = useSelector(state => state.spots.singleSpot)
  const sessionUser = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchOneSpot(+spotId));
  }, [dispatch]);

  const handleDelete = (e) => {
    history.push('/Spots/:SpotId/edit')
  }

  const handleEdit = async (e) => {
    await dispatch(deleteOneSpot(spotId))
    history.push('/spots')
  }
  return (
    <div>
      {spot && spot.SpotImages && (
        <div>

          <div>
            <h2>{spot.name}</h2>
            <div>
              <div>
                <span>avgRating: ({spot.avgRating}) </span>
                <span>{spot.city},{spot.state}, {spot.country}</span>
              </div>
              {sessionUser && sessionUser.id === spot.ownerId && (
                <>
                  <button onClick={handleEdit}>Edit</button>
                  {/* <button onClick={handleDelete}>Delete</button> */}
                </>
              )}
            </div>
          </div>
          <div>
            <img style={{ height: "400px",width: "400px"}} src={spot.SpotImages[0].url} />
          </div>
        </div>
      )}
    </div>

  )
}
