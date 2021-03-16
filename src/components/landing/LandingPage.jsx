import React from 'react';
import PropTypes from 'prop-types';
import '../../scss/landing.scss';

function LandingPage({ card }) {
  return (
    <div className="landing-container">
      <div className="landing-body">
        <div className="landing-header-container">
          <h1 className="landing-header">Welcome back to our app!</h1>
        </div>
        {card}
      </div>
    </div>
  );
}

LandingPage.propTypes = {
  card: PropTypes.elementType.isRequired,
};

export default LandingPage;
