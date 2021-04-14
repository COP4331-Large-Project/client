import '../scss/verify-email-page.scss';
import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { Link } from 'react-router-dom';
import { AiOutlineLoading } from 'react-icons/ai';
import { motion } from 'framer-motion';
import Card from '../components/Card.jsx';
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
  delay: 0.3,
  duration: 1.5,
  ease: [0.16, 1, 0.3, 1],
};

function VerifyEmailPage() {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const userId = params.get('id');
  const verificationCode = params.get('code');

  const verifyEmail = async () => {
    setLoading(true);

    try {
      await API.verifyEmail(userId, verificationCode);
    } catch (err) {
      // TODO: Handle errors here
    }

    // TODO: Dummy code to test random errors, will be removed
    setHasError(!!Math.round(Math.random()));

    setLoading(false);
  };

  useEffect(() => {
    if (!userId || !verificationCode) {
      return;
    }
    verifyEmail();
  }, []);

  const renderAlert = () => {
    if (isLoading) {
      return (
        <Alert
          type="info"
          message="Hold Tight!"
          description="Just a sec while we verify your email..."
        />
      );
    }

    return hasError ? (
      <Alert
        type="error"
        message="Unexpected Error"
        description={`
          An unexpected error occurred. Make sure your
          email link is valid and refresh to try again.
        `}
      />
    ) : (
      <Alert
        type="success"
        message="Success!"
        description={
          <span>
            Your email has been verified.{' '}
            <Link to="/" className="card-link" replace>
              Click here
            </Link>{' '}
            to go back to the login page.
          </span>
        }
      />
    );
  };

  return (
    <div className="verify-email-page">
      <div className="card-container">
        <motion.div
          initial="hidden"
          animate="show"
          transition={animationOpts}
          variants={animationVariants}
          className="verify-card-wrapper"
        >
          <Card className="verify-card">
            <div className="card-title-wrapper">
              <h2 className="title">Email Verification</h2>
              {isLoading && (
                <AiOutlineLoading size={28} className="loading-indicator" />
              )}
            </div>
            {!userId || !verificationCode ? (
              <Alert
                type="error"
                message="Invalid Link"
                description={`
                  This verification link is invalid. Make sure the
                  URL matches the link from your email.
              `}
              />
            ) : (
              renderAlert()
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
