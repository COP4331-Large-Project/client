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
    <LandingCard title="Log In">
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
