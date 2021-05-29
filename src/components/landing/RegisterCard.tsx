/* eslint-disable */
import { SyntheticEvent, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, message } from 'antd';
import PasswordChecklist from 'react-password-checklist';
import LandingCard from './LandingCard.jsx';
import TextInput from '../TextInput.jsx';
import Button from '../Button.jsx';
import API from '../../api/API';
import { CardProps } from './types.js';

function RegisterCard({ switchCard }: CardProps ) {
  const [err, setError] = useState(null);
  const [isRegistered, setRegistered] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [valid, setValid] = useState(false);
  function isTrimmedEmpty(str: FormDataEntryValue) {
    const converted = str as string;
    if (converted.trim() === '') return true;
    return false;
  }

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setLoading(true);
    const formInfo = new FormData(event.target as HTMLFormElement);
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
      if (!valid) throw new Error('Password is not valid');
      setUserEmail(data.email as string);

      // Calling register API
      await API.register({
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        username: data.username as string,
        password: data.passwor as string,
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
      setError(e.message);
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
        onChange={c => setPassword(c)}
        required
      />
      <TextInput
        placeHolder="Confirm password"
        type="password"
        name="confirmPassword"
        onChange={c => setConfirmPassword(c)}
        required
      />
      <PasswordChecklist
          className="password-checklist"
          rules={['length', 'specialChar', 'number', 'capital', 'match']}
          minLength={8}
          value={password}
          valueAgain={confirmPassword}
          /* eslint-disable-next-line no-unused-vars */
          onChange={(isValid) => { setValid(isValid); }}
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
    <LandingCard title="Register" error={err ?? undefined}>
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
