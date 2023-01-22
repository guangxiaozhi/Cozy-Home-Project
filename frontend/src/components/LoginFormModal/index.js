import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { Redirect } from 'react-router-dom'
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const seesionUser = useSelector(state => state.session.user)
  if(seesionUser){
    return (<Redirect to='/' />)
  }

  //check session user.if exit, return Redirect('/')

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).then(closeModal)

      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors)
        };
      });
  }

  const demoUserClick = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential:"Demo-lition", password:"password" })).then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }
  return (
    <>
      <h2 className='login-header'>Log In</h2>
      <form onSubmit={handleSubmit} className="login-form-container">
        <ul className='login-errors'>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
          <input
            className='login-information'
            type="text"
            placeholder="Username/Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            className='login-information'
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button className='login-button' type="submit">Log In</button>
        <button className='login-button' onClick={demoUserClick}>demo-user</button>
      </form>
    </>

  );
}

export default LoginFormModal;
