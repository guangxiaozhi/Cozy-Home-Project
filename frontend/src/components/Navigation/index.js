import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);


  return (
    <ul className='navigation'>
      <li className="menu-list">
        <NavLink exact to="/">Home</NavLink>
      </li>
      <div className='right-part'>
        <li className='create-new-spot menu-list'>
        <NavLink to="/spots/newSpot">Create New Spot</NavLink>
      </li>
      {isLoaded && (
        <li className='dropdown-menu menu-list'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      </div>

    </ul>
  );
}

export default Navigation;
