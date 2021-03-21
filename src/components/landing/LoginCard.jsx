import React from 'react';
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
        <TextInput placeHolder="Username" name="Username" />
        <TextInput placeHolder="Password" name="Password" type="password" />
        <Button type="submit">Login</Button>
      </form>
    </LandingCard>
  );
}

export default LoginCard;
