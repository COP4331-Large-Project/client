import React from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

function LoginCard({ switchCard }) {
  async function onSubmit(event) {
    event.preventDefault();
  }

  return (
    <LandingCard title="Welcome Back">
      <form className="card-form" onSubmit={onSubmit}>
        <TextInput placeHolder="Username" name="Username" />
        <TextInput placeHolder="Password" name="Password" type="password" />
        <Button type="submit">Login</Button>
        <Button onClick={() => switchCard('groupLogin')}>Have a group code?</Button>
      </form>
    </LandingCard>
  );
}

LoginCard.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default LoginCard;
