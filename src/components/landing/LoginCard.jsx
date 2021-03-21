import React from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';

function LoginCard() {
  async function login(event) {
    event.preventDefault();

    // TODO API
  }

  return (
    <LandingCard title="Welcome Back">
      <form onSubmit={login}>
        <TextInput placeHolder="username" key="Username" />
        <TextInput placeHolder="password" key="Password" type="password" />
        <Button type="submit">Login</Button>
      </form>
    </LandingCard>
  );
}

export default LoginCard;
