import React from 'react';
import PropTypes from 'prop-types';
import '../scss/text-input.scss';

function DisplayBox({ className, text }) {
  return (
    <div className={`text-input ${className}`}>
        {text}
    </div>
  );
}

DisplayBox.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

DisplayBox.defaultProps = {
  className: '',
  text: '',
};

export default DisplayBox;
