import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, message } from 'antd';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import API from '../../api/API';

function RegisterCard({ switchCard }) {
  const [err, setError] = useState(null);
  const [isRegistered, setRegistered] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  function isTrimmedEmpty(str) {
    if (str.trim() === '') return true;
    return false;
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setLoading(true);
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
      if (!data.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g)) {
        throw (new Error('Your password must be at least 8 characters long, include a lowercase letter, uppercase letter, a number, and a special character.'));
      }
      setUserEmail(data.email);

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
      setLoading(false);
      return;
    }

    setRegistered(true);
    setError(null);
    setLoading(false);
  }

  const resendEmail = async () => {
    setLoading(true);

    try {
      await API.requestEmailVerificationLink(userEmail);
      message.success('An email was sent to your inbox');
    } catch (e) {
      setError(e);
    }

    setLoading(false);
  };

  const registerForm = (
    <form onSubmit={onSubmit}>
      <div className="input-group">
        <TextInput placeHolder="First name" name="firstName" required />
        <TextInput placeHolder="Last name" name="lastName" required />
      </div>
      <TextInput placeHolder="Username" name="username" required />
      <TextInput placeHolder="Email" type="email" name="email" required />
      <TextInput
        placeHolder="Password"
        type="password"
        name="password"
        required
      />
      <TextInput
        placeHolder="Confirm password"
        type="password"
        name="confirmPassword"
        required
      />
      <Button className="btn-submit" type="submit" disabled={isLoading}>
        Register
      </Button>
      <Button className="btn-link" onClick={() => switchCard('login')}>
        Back to login
      </Button>
    </form>
  );

  const successMessage = (
    <div className="form-area-success">
      <Alert
        type="success"
        message="Account Created!"
        description={`
          A verification email was sent to your inbox.
          Click the link to verify your email before
          logging in.
        `}
      />
      <p className="resend-text">Didn&apos;t get the email?</p>
      <Button onClick={resendEmail} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Resend'}
      </Button>
      <Button className="btn-link" onClick={() => switchCard('login')}>
        Back to login
      </Button>
    </div>
  );

  return (
    <LandingCard title="Register" error={err}>
      {isRegistered ? successMessage : registerForm}
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
