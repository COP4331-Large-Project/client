import React, { useState } from 'react';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';

function RegisterCard({ switchCard }) {
  // eslint-disable-next-line no-unused-vars
  const [err, setError] = useState(null);

  const register = event => {
    event.preventDefault();
    setError('Not Implemented');
  };

  return (
    <LandingCard title="Register" error={err}>
      <form>
        <div className="input-group">
          <TextInput placeHolder="First name" />
          <TextInput placeHolder="Last name" />
        </div>
        <TextInput placeHolder="Username" />
        <TextInput placeHolder="Email" type="email" />
        <TextInput placeHolder="Password" type="password" />
        <TextInput placeHolder="Confirm password" type="password" />
        <Button className="btn-submit" onClick={register}>Register</Button>
        <Button className="btn-link" onClick={() => switchCard('login')}>
          Back to login
        </Button>
      </form>
    </LandingCard>
  );
}

RegisterCard.propTypes = {
  switchCard: PropTypes.func,
};

RegisterCard.defaultProps = {
  switchCard: () => {},
};

export default RegisterCard;
