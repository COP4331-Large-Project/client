import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import '../../scss/landing.scss';
import 'antd/lib/alert/style/index.css';

function LandingCard({
  // eslint-disable-next-line no-unused-vars
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
      <h1>{title}</h1>
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
