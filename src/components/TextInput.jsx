import 'antd/lib/input/style/index.css';
import '../scss/text-input.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

function TextInput({
  className,
  placeHolder,
  type,
  value,
  onChange,
  name,
  required,
}) {
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = event => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Input
      type={type}
      className={`text-input ${className}`}
      placeholder={placeHolder}
      onChange={onInputChange}
      name={name}
      required={required}
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
  name: PropTypes.string,
  required: PropTypes.bool,
};

TextInput.defaultProps = {
  required: false,
  className: '',
  placeHolder: '',
  value: '',
  onChange: () => {},
  type: 'text',
  name: null,
};

export default TextInput;
