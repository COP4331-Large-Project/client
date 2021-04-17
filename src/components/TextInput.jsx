import '../scss/text-input.scss';
import React, { useEffect, useState } from 'react';
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
  readOnly,
}) {
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = event => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Input
      type={type}
      className={`text-input ${className}`}
      placeholder={placeHolder}
      onChange={onInputChange}
      name={name}
      required={required}
      value={inputValue}
      readOnly={readOnly}
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
  readOnly: PropTypes.bool,
};

TextInput.defaultProps = {
  required: false,
  className: '',
  placeHolder: '',
  value: '',
  onChange: () => {},
  type: 'text',
  name: null,
  readOnly: false,
};

export default TextInput;
