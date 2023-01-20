import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import CreateNewSpot from '../../components/Spots/CreateNewSpot';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  const handleClick = (spotId) => {
    history.push("/spots")
  }
  return (
    <ul className='navigation'>
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      <li>
        <NavLink to="/spots/newSpot">Create New Spot</NavLink>
      </li>
    </ul>
  );
}

export default Navigation;
