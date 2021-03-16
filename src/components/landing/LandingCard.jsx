import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/landing.scss';
import '../../scss/debug.scss';

function LandingCard({ title, children }) {
  return <div className="landing-card">
    <h1>{title}</h1>
    <div className="landing-card-content-container debug-container">
      {children}
    </div>
  </div>;
}

LandingCard.defaultProps = {
  children: <div className=""/>,
};

LandingCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default LandingCard;
