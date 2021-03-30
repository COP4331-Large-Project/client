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

  function isTrimmedEmpty(str) {
    if (str.trim() === '') return true;
    return false;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const formInfo = new FormData(event.target);
    const data = Object.fromEntries(formInfo.entries());

    try {
      // Checking if passwords match
      if (data.Password !== data.ConfirmPassword) throw (new Error('Passwords do not match.'));
      if (isTrimmedEmpty(data.FirstName)) throw (new Error('First name input required.'));
      if (isTrimmedEmpty(data.LastName)) throw (new Error('Last name input required.'));
      if (isTrimmedEmpty(data.Username)) throw (new Error('Username input required.'));
      if (isTrimmedEmpty(data.Email)) throw (new Error('Email input required.'));
      if (isTrimmedEmpty(data.Password)) throw (new Error('Password input required.'));
      if (isTrimmedEmpty(data.ConfirmPassword)) throw (new Error('Confirm password input required.'));

      // Calling register API
      await API.register({
        firstName: data.FirstName,
        lastName: data.LastName,
        email: data.Email,
        username: data.Username,
        password: data.Password,
      });
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
