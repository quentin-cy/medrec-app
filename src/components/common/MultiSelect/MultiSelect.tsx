import { useState, useRef, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon } from '../icons/icons.tsx';
import './MultiSelect.css';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  values: string[];
  onValuesChange: (values: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  label?: string;
  hasError?: boolean;
}

export function MultiSelect({
  values,
  onValuesChange,
  options,
  placeholder = 'Select...',
  label,
  hasError = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleOption = (value: string) => {
    if (values.includes(value)) {
      onValuesChange(values.filter(v => v !== value));
    } else {
      onValuesChange([...values, value]);
    }
  };

  const displayText =
    values.length > 0
      ? options
          .filter(o => values.includes(o.value))
          .map(o => o.label)
          .join(', ')
      : '';

  const triggerClass = [
    'multiselect-trigger',
    hasError ? 'multiselect-trigger-error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="multiselect-wrapper" ref={wrapperRef}>
      {label && <label className="multiselect-label">{label}</label>}
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen(!open)}
      >
        <span
          className={
            displayText ? 'multiselect-value' : 'multiselect-placeholder'
          }
        >
          {displayText || placeholder}
        </span>
        <span className="multiselect-icon">
          <ChevronDownIcon />
        </span>
      </button>

      {open && (
        <div className="multiselect-content">
          <div className="multiselect-viewport">
            {options.map(option => {
              const selected = values.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`multiselect-item${selected ? ' multiselect-item-selected' : ''}`}
                  onClick={() => toggleOption(option.value)}
                >
                  <span>{option.label}</span>
                  {selected && (
                    <span className="multiselect-item-indicator">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
