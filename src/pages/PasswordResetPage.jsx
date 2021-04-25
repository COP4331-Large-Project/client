import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { notification, Alert } from 'antd';
import PropTypes from 'prop-types';
import PasswordChecklist from 'react-password-checklist';
import Card from '../components/Card.jsx';
import TextInput from '../components/TextInput.jsx';
import Button from '../components/Button.jsx';
import '../scss/password-reset-page.scss';
import API from '../api/API';

const animationVariants = {
  hidden: {
    opacity: 0,
    transform: 'translateY(50%)',
  },
  show: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
};

const animationOpts = {
  duration: 1.5,
  ease: [0.16, 1, 0.3, 1],
};

function PasswordResetPage({ userId }) {
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [valid, setValid] = useState('');
  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const verificationCode = params.get('verificationCode');

  function isTrimmedEmpty(str) {
    if (str.trim() === '') return true;
    return false;
  }

  function goBack() {
    history.replace('/');
    setSubmitted(false);
  }

  async function changePassword(event) {
    event.preventDefault();

    try {
      await API.passwordReset(userId, verificationCode, password);

      setSubmitted(true);

      notification.success({
        message: 'Success',
        description: `
          Password has been reset. Please click the
          "Back to login" button to log in.
        `,
      });
    } catch (err) {
      notification.error({
        message: 'Error Resetting Password',
        description: `
          An error occurred while resetting
          your password, please try again.
        `,
      });
    }
  }

  const passwordResetForm = (
    <form onSubmit={changePassword}>
      <Card className="reset-card">
        <h1 className="card-title">Reset Password</h1>
        <p className="card-text">
          Please enter your new password. Your password must be at least 8
          characters long, include a lowercase letter, uppercase letter, a
          number, and a special character.
        </p>
        <TextInput
          className="textbox"
          type="password"
          placeHolder="Enter a password"
          onChange={setPassword}
        />
        <TextInput
          className="textbox"
          type="password"
          placeHolder="Confirm your password"
          onChange={setConfirmedPassword}
        />
        <PasswordChecklist
          className="password-checklist"
          rules={['length', 'specialChar', 'number', 'capital', 'match']}
          minLength={8}
          value={password}
          valueAgain={confirmedPassword}
          onChange={setValid}
        />
        <Button
          className="btn submit"
          type="submit"
          disabled={
            // prettier-ignore
            submitted
            || !valid
            || isTrimmedEmpty(password)
            || isTrimmedEmpty(confirmedPassword)
          }
        >
          Reset Password
        </Button>
        <Button onClick={goBack} className="btn-link">
          Back to login
        </Button>
      </Card>
    </form>
  );

  const invalidLinkAlert = (
    <Card className="reset-card">
      <h1 className="card-title">Invalid Link</h1>
      <Alert
        type="error"
        className="invalid-link-alert"
        message="Invalid Link"
        description={`
          This link is invalid. Make sure the
          URL matches the link from you email.
        `}
      />
      <Button variant="link" onClick={goBack}>
        Back to login
      </Button>
    </Card>
  );

  return (
    <div className="password-reset-page">
      <div className="card-container">
        <motion.div
          initial="hidden"
          animate="show"
          className="reset-card-wrapper"
          transition={animationOpts}
          variants={animationVariants}
        >
          {!verificationCode ? invalidLinkAlert : passwordResetForm}
        </motion.div>
      </div>
    </div>
  );
}

PasswordResetPage.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default PasswordResetPage;
