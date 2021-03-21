import React from 'react';
import PropTypes from 'prop-types';

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
  type: PropTypes.string,
};

export default Button;
