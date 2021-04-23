import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
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
  const params = new URLSearchParams(window.location.search);
  const verificationCode = params.get('verificationCode');
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [valid, setValid] = useState('');
  const history = useHistory();

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
      if (!valid) throw new Error('The password does not meet the requirements');

      if (password !== confirmedPassword) {
        notification.error({
          description: 'Passwords do not match',
        });

        return;
      }
      await API.passwordReset(userId, verificationCode, password);

      setSubmitted(true);
      notification.success({
        description: 'Password has been reset. Please click the "Back to login" button to log in.',
      });
    } catch (err) {
      notification.error({
        description: 'Password was not reset.',
      });
    }
  }

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
          <form onSubmit={changePassword}>
            <Card className="reset-card">
              <h1 className="card-title">Reset Password</h1>
              <p className="card-text">
                Please enter your new password. Your password must be at least 8 characters long,
                 include a lowercase letter, uppercase letter, a number, and a special character.
              </p>
              <TextInput
                className="textbox"
                type="password"
                placeHolder="Enter a password"
                onChange={(c) => { setPassword(c); }}
              />
              <TextInput
                className="textbox"
                type="password"
                placeHolder="Confirm your password"
                onChange={(c) => { setConfirmedPassword(c); }}
              />
              <PasswordChecklist
                  rules={['length', 'specialChar', 'number', 'capital', 'match']}
                  minLength={8}
                  value={password}
                  valueAgain={confirmedPassword}
                  onChange={(isValid) => { setValid(isValid); }}
              />
              <Button
                className="btn submit"
                type="submit"
                disabled={
                  submitted || isTrimmedEmpty(password) || isTrimmedEmpty(confirmedPassword)
                }
              >
                Reset Password
              </Button>
              <Button onClick={goBack} className="btn-link">
                Back to login
              </Button>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

PasswordResetPage.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default PasswordResetPage;
