import '../scss/text-input.scss';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TextInput({
  className,
  placeHolder,
  type,
  value,
  onChange,
  error,
  errorMessage,
}) {
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = event => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="text-input-container">
      <input
        type={type}
        className={`text-input ${className} ${error ? 'has-error' : ''}`}
        placeholder={placeHolder}
        onChange={onInputChange}
        value={inputValue}
      />
      {errorMessage && error && (
        <p className="text-input-error">{errorMessage}</p>
      )}
    </div>
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  placeHolder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.oneOf(['email', 'password', 'text']),
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};

TextInput.defaultProps = {
  className: '',
  placeHolder: '',
  value: '',
  /**
   * @param {string} text The current input value
   */
  // eslint-disable-next-line no-unused-vars
  onChange: text => {},
  type: 'text',
  error: false,
  errorMessage: '',
};

export default TextInput;
