import React from 'react';
import PropTypes from 'prop-types';
import '../scss/button.scss';

function Button({
  className,
  variant,
  children,
  onClick,
  type,
  disabled,
}) {
  const noop = () => {};

  return (
    <button
      onClick={disabled ? noop : onClick}
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
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
  disabled: false,
};

Button.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
};

export default Button;
