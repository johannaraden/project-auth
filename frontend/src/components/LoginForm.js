import React, { useState } from 'react';
import Profile from './Profile';
import { useDispatch, useSelector } from 'react-redux';
import { user } from '../reducers/user';
import styled from 'styled-components';
import { Headline } from '../lib/headline';
import { Button } from '../lib/button';
const SIGNUP_URL = 'http://localhost:8080/users';
const LOGIN_URL = 'http://localhost:8080/sessions';


const Form = styled.form`
  width: 60%;
  margin: 1em auto;
  --background: white;
  --border: rgba(0, 0, 0, 0.125);
  --borderDark: rgba(0, 0, 0, 0.25);
  --borderDarker: rgba(0, 0, 0, 0.5);
  --bgColorH: 0;
  --bgColorS: 0%;
  --bgColorL: 98%;
  --fgColorH: 210;
  --fgColorS: 50%;
  --fgColorL: 38%;
  --shadeDark: 0.3;
  --shadeLight: 0.7;
  --shadeNormal: 0.5;
  --borderRadius: 0.125rem;
  --highlight: #306090;
  background: white;
  box-shadow: 0 1rem 1rem -0.75rem var(--border);
  display: flex;
  flex-direction: column;
  border-radius: 6px 6px;
`
const InfoDiv = styled.div`
  margin: 2em auto;
  display: flex;
  flex-direction: column;
  width: 40%;
`
const Input = styled.input`
  height: 2.5em;
  margin-top: 1em;
  border: 1px solid #ccc;
  background-color: #fff;
`;

export const LoginForm = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((store) => store.user.login.accessToken);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleLoginSuccess = (loginResponse) => {
    // For debugging only
    console.log('You have successfully logged in')
    const statusMessage = JSON.stringify(loginResponse);
    dispatch(user.actions.setLoginResponse({ statusMessage }));

    // Save the login info
    dispatch(user.actions.setLoginResponse({ accessToken: loginResponse.accessToken, userId: loginResponse.userId })
    );
    // dispatch(user.actions.setUserId({ userId: loginResponse.userId }));
  };

  const handleLoginFailed = (loginError) => {
    const statusMessage = JSON.stringify(loginError);
    dispatch(user.actions.setLoginResponse({ statusMessage }));

    // Clear login values
    dispatch(user.actions.logout());
  };

  // To sign up a user.
  const handleSignup = (event) => {
    event.preventDefault();
    console.log('Trying to sign up ...')
    fetch(SIGNUP_URL, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(console.log('fetched signing in...'))
      .then((res) => res.json())
      .then((loginResponse) => {
        dispatch(user.actions.setLoginResponse({ accessToken: loginResponse.accessToken, userId: loginResponse.userId }))
      })
    // .then((json) => handleLoginSuccess(json))
    // .catch((err) => handleLoginFailed(err));
  }

  // To log in a user.
  const handleLogin = (event) => {
    event.preventDefault();

    fetch(LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(console.log('Logging in...'))
      .then((json) => handleLoginSuccess(json))
      .catch((err) => handleLoginFailed(err));
  };

  if (!accessToken) {
    // If user is logged out, show login form
    return (
      <div>
        <Profile />
        <Form onSubmit={(event) => handleSignup(event)}>
          <Headline title="sign up" />
          <InfoDiv>
            <Input
              placeholder="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              placeholder="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {/* <Button onClick={handleSignup} title="Sign up" /> */}
            <Button type="submit" title="Sign up" />
          </InfoDiv>
        </Form>
      </div>
    );
  } else {
    // If user is logged in, show profile
    return <Profile />;
  }
};
export default LoginForm;