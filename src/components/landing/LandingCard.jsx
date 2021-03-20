import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/landing.scss';

function LandingCard({ title, children, className }) {
  return (
    <div className={`landing-card ${className}`}>
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
};

LandingCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default LandingCard;
