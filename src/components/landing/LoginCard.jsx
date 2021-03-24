import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import '../../scss/landing.scss';

function LoginCard({ switchCard }) {
  // eslint-disable-next-line no-unused-vars
  const [err, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    setError('Not Implemented.');
  }

  return (
    <LandingCard title="Log In" error={err}>
      <form onSubmit={onSubmit}>
        <div className="vertical-input-group">
          <TextInput placeHolder="Username" name="Username" />
          <TextInput placeHolder="Password" name="Password" type="password" />
        </div>
        <Button type="submit">Login</Button>
        <Button className="btn-link" onClick={() => switchCard('groupLogin')}>Have a group code?</Button>
        <Button className="btn-link" onClick={() => switchCard('register')}>Don&apos;t have an Account?</Button>
      </form>
    </LandingCard>
  );
}

LoginCard.propTypes = {
  switchCard: PropTypes.func.isRequired,
};

export default LoginCard;
