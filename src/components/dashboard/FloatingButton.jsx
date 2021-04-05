import React from 'react';
import PropTypes from 'prop-types';

import '../../scss/floating-button.scss';

function FloatingButton({ onClick, children }) {
  return (
        <div onClick={onClick} className="floating-button">
            {children}
        </div>
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
