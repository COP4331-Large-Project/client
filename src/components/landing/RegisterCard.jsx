import '../../scss/register-card.scss';
import React from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';

function RegisterCard({ onLoginClick }) {
  const onFormSubmit = event => {
    event.preventDefault();
  };

  return (
    <LandingCard title="Register" className="register-card">
      <form onSubmit={onFormSubmit}>
        <div className="input-group">
          <TextInput placeHolder="First name" />
          <TextInput placeHolder="Last name" />
        </div>
        <TextInput placeHolder="Username" />
        <TextInput placeHolder="Email" type="email" />
        <TextInput placeHolder="Password" type="password" />
        <TextInput placeHolder="Confirm password" type="password" />
        <Button className="btn-submit">Register</Button>
        <Button className="btn-login" onClick={onLoginClick}>
          Back to login
        </Button>
      </form>
    </LandingCard>
  );
}

RegisterCard.propTypes = {
  onLoginClick: PropTypes.func,
};

RegisterCard.defaultProps = {
  onLoginClick: () => {},
};

export default RegisterCard;
