import '../scss/text-input.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TextInput(props) {
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
      className={`text-input ${className}`}
      placeholder={placeHolder}
      onChange={onChange}
      value={value}
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
