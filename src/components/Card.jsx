// Importing react.
import React from 'react';
// Importing scss.
import '../scss/card.scss';
// Importing PropTypes, defines the props for this component.
import PropTypes from 'prop-types';

function Card({ className, children }) {
  return (
    <div
      className={`card ${className}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};

Card.defaultProps = {
  className: '',
  children: [],
};

export default Card;
