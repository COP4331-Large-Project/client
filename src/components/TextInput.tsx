import '../scss/text-input.scss';
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

type TextInputProps = {
  className?: string;
  placeHolder?: string;
  type?: 'text' | 'password' | 'email';
  value?: string;
  onChange?: (newValue: string) => void;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
};

function TextInput({
  className,
  placeHolder,
  type = 'text',
  value = '',
  onChange,
  name = undefined,
  required = false,
  readOnly = false,
}: TextInputProps): JSX.Element {
  const [inputValue, setInputValue] = useState(value);

  const onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
    if (onChange) onChange(event.currentTarget.value);
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

export default TextInput;
