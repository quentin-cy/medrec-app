import './TextField.css';
import * as Label from '@radix-ui/react-label';
import * as React from 'react';

interface TextFieldProps {
  id: string;
  label?: string;
  value: string | null;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}
export function TextField({
  id,
  label,
  placeholder,
  onChange,
  value,
  error,
}: TextFieldProps) {
  return (
    <div className="text-field">
      {label ? (
        <Label.Root className="text-field-label" htmlFor={id}>
          {label}
        </Label.Root>
      ) : (
        ''
      )}
      <input
        id={id}
        className={
          error ? 'text-field-input text-field-input-error' : 'text-field-input'
        }
        type="text"
        value={value ? value : ''}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="text-field-error-text">{error}</span>}
    </div>
  );
}
