import '../scss/text-input.scss';
import React, { useEffect, useRef, useState } from 'react';
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
  const inputRef = useRef(null);

  const onInputChange = event => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  useEffect(() => {
    // Toggles the :invalid pseudo-class on the input. Setting an
    // empty string removes the pseudo-class
    inputRef.current.setCustomValidity(error ? errorMessage : '');
  }, [error]);

  return (
    <div className={`text-input-container ${className}`}>
      <input
        ref={inputRef}
        type={type}
        className="text-input"
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
  onChange: () => {},
  type: 'text',
  error: false,
  errorMessage: '',
};

export default TextInput;
