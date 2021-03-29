/* eslint-disable */

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import API from '../../api/API';

function RegisterCard({ switchCard }) {
  const history = useHistory();
  const [err, setError] = useState(null);

  async function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    try {
      // Checking if passwords match
      if (data.get('Password') !== data.get('ConfirmPassword')) throw (new Error('Passwords do not match.'));

      
      // Calling register API
      await API.register(
        data.get('FirstName'),
        data.get('LastName'),
        data.get('Email'),
        data.get('Username'),
        data.get('Password'),
      );
    } catch (e) {
      setError(e.message);
      return;
    }
    // Move to the home page after successfully registering
    history.push('/main');
  }

  return (
    <LandingCard title="Register" error={err}>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <TextInput placeHolder="First name" name="FirstName" required/>
          <TextInput placeHolder="Last name" name="LastName" required/>
        </div>
        <TextInput placeHolder="Username" name="Username" required/>
        <TextInput placeHolder="Email" type="email" name="Email" required/>
        <TextInput placeHolder="Password" type="password" name="Password" required/>
        <TextInput placeHolder="Confirm password" type="password" name="ConfirmPassword" required/>
        <Button className="btn-submit" type="submit">Register</Button>
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
  switchCard: () => { },
};

export default RegisterCard;
