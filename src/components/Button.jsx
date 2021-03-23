import React from 'react';
import PropTypes from 'prop-types';
import '../scss/button.scss';

function Button({
  className,
  variant,
  children,
  onClick,
  type,
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  variant: 'primary',
  children: [],
  onClick: () => {},
  className: '',
  type: 'button',
};

Button.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;
