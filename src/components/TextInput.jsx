import '../scss/text-input.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TextInput({
  className,
  placeHolder,
  type,
  value,
  onChange,
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
    />
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['email', 'password', 'text']),
};

TextInput.defaultProps = {
  className: '',
  placeHolder: '',
  value: '',
  onChange: () => {},
  type: 'text',
};

export default TextInput;
