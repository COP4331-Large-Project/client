import React from 'react';
import { motion } from 'framer-motion';
import { notification } from 'antd';
import PropTypes from 'prop-types';
import Card from '../components/Card.jsx';
import TextInput from '../components/TextInput.jsx';
import Button from '../components/Button.jsx';
import '../scss/password-reset-page.scss';

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
  /* eslint no-unused-vars: */
  const params = new URLSearchParams(window.location.search);
  const verificationCode = params.get('verificationCode');

  function changePassword(event) {
    event.preventDefault();
    notification.success({
      message: 'Test',
    });
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
              <p>Please enter your new password</p>
              <TextInput className="textbox" type="password" />
              <Button className="btn" type="submit">
                Reset Password
              </Button>
              <Button className="btn-link">
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
