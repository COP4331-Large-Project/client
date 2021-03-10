import '../scss/input.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Input(props) {
  const { className, placeHolder, type } = props;
  const [value, setValue] = useState(props.value);

  const onChange = event => {
    const inputValue = event.target.value;
    setValue(inputValue);
    props.onChange(inputValue);
  };

  return (
    <input
      type={type}
      className={`input ${className}`}
      placeholder={placeHolder}
      onChange={onChange}
      value={value}
    />
  );
}

Input.propTypes = {
  className: PropTypes.string,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['email', 'password', 'text']),
};

Input.defaultProps = {
  className: '',
  placeHolder: '',
  value: '',
  onChange: () => {},
  type: 'text',
};

export default Input;
