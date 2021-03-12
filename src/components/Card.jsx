// Importing react.
import React from 'react';
// Importing scss.
import '../scss/card.scss';
// Importing PropTypes, defines the props for this component.
import PropTypes from 'prop-types';

function Card({ children }) {
  return (
        <div
          className = 'card'
        >
            {children}
        </div>
  );
}

Card.propTypes = {
  children: PropTypes.element,
};

Card.defaultProps = {
  children: [],
};

export default Card;
