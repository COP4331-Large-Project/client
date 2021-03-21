import '../scss/text-input.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TextInput({
  className,
  placeHolder,
  type,
  value,
  onChange,
  name,
}) {
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = event => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <input
      type={type}
      className={`text-input ${className}`}
      placeholder={placeHolder}
      onChange={onInputChange}
      value={inputValue}
      key={name}
    />
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['email', 'password', 'text']),
  name: PropTypes.string,
};

TextInput.defaultProps = {
  className: '',
  placeHolder: '',
  value: '',
  onChange: () => {},
  type: 'text',
  name: null,
};

export default TextInput;
