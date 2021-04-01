import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import '../../scss/landing.scss';

function LandingCard({
  title, children, className, error,
}) {
  return (
    <div className={`landing-card ${className}`}>
      {
        error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            closable
          />
        )
      }
      <h1 style={{ width: '100%' }} align="center">{title}</h1>
      <div className="landing-card-content-container">
        {children}
      </div>
    </div>
  );
}

LandingCard.defaultProps = {
  children: <div className="" />,
  className: '',
  error: null,
};

LandingCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default LandingCard;
