import React from 'react';
import PropTypes from 'prop-types';
import { Flash } from '@primer/components';
import '../../scss/landing.scss';
import { XIcon } from '@primer/octicons-react';

function LandingCard({
  title, children, className, error,
}) {
  return (
    <div className={`landing-card ${className}`}>
      {
        error
          ? <Flash variant="danger">
              <XIcon/>
              {error}
            </Flash> : <div />
      }
      <h1 style={{
        width: '100%',
      }} align="left">{title}</h1>
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
