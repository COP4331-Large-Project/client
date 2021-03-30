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
    const data = Object.fromEntries(formInfo);

    try {
      // Checking if passwords match
      if (data.password !== data.confirmPassword) throw (new Error('Passwords do not match.'));
      if (isTrimmedEmpty(data.firstName)) throw (new Error('First name input required.'));
      if (isTrimmedEmpty(data.lastName)) throw (new Error('Last name input required.'));
      if (isTrimmedEmpty(data.username)) throw (new Error('Username input required.'));
      if (isTrimmedEmpty(data.email)) throw (new Error('Email input required.'));
      if (isTrimmedEmpty(data.password)) throw (new Error('Password input required.'));
      if (isTrimmedEmpty(data.confirmPassword)) throw (new Error('Confirm password input required.'));

      // Calling register API
      await API.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        username: data.username,
        password: data.password,
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
          <TextInput placeHolder="First name" name="firstName" required/>
          <TextInput placeHolder="Last name" name="lastName" required/>
        </div>
        <TextInput placeHolder="Username" name="username" required/>
        <TextInput placeHolder="Email" type="email" name="email" required/>
        <TextInput placeHolder="Password" type="password" name="password" required/>
        <TextInput placeHolder="Confirm password" type="password" name="confirmPassword" required/>
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
