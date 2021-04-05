import React from 'react';
import PropTypes from 'prop-types';

import '../../scss/floating-button.scss';

function FloatingButton({ onClick, children }) {
  return (
        <button onClick={onClick} className="floating-button">
            {children}
        </button>
  );
}

FloatingButton.defaultProps = {
  onClick: () => {},
  children: <> </>,
};

FloatingButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default FloatingButton;
