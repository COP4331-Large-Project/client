import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { notification } from 'antd';
import PropTypes from 'prop-types';
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
  const history = useHistory();

  function isTrimmedEmpty(str) {
    if (str.trim() === '') return true;
    return false;
  }

  function goBack() {
    history.replace('/');
    setSubmitted(false);
  }

  function changePassword(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    try {
      const password = data.get('password');
      const confirmedPassword = data.get('confirmedPassword');

      // Empty case
      if (isTrimmedEmpty(password) === true || isTrimmedEmpty(confirmedPassword) === true) {
        throw (new Error('Password fields cannot be empty.'));
      }
      /// Different
      if (password !== confirmedPassword) {
        throw (new Error('Passwords do not match.'));
      }

      API.passwordReset(userId, verificationCode, password);

      setSubmitted(true);
      notification.success({
        message: 'Password has been reset, navigating to home page.',
        duration: 2,
      });

      setTimeout(() => { goBack(); }, 2000);
    } catch (err) {
      notification.error({
        message: `${err.message}`,
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
                name="password"
              />
              <TextInput
                className="textbox"
                type="password"
                placeHolder="Confirm your password"
                name="confirmedPassword"
              />
              <Button
                className="btn"
                type="submit"
                disabled={submitted}
              >
                Reset Password
              </Button>
              <Button onClick={goBack} className="btn-link">
                Take me back
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

PasswordResetPage.defaultProps = {
  userId: '',
};

export default PasswordResetPage;
