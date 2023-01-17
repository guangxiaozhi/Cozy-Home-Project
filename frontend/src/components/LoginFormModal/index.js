import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import { Redirect } from 'react-router-dom'
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const seesionUser = useSelector(state => {console.log("state      loginForm",state)
    return state.session.user
  })
  if(seesionUser){
    return (<Redirect to='/' />)
  }

  //check session user.if exit, return Redirect('/')

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  const handleClick = () => {
    setCredential("Demo-lition");
    setPassword("password")
  }
  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="LoginForm">
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Username or Email:
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <button onClick={handleClick}>demo-user</button>
      </form>
    </>

  );
}

export default LoginFormModal;
