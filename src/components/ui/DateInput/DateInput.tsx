import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import {
  isoToEuropean,
  europeanToIso,
  isValidEuropeanDate,
} from '../../../lib/utils';
import 'react-day-picker/style.css';
import './DateInput.css';

interface DateInputProps {
  value: string; // ISO YYYY-MM-DD
  onChange: (isoDate: string) => void;
  hasError?: boolean;
  id?: string;
  placeholder?: string;
}

/**
 * Parse an ISO date string (YYYY-MM-DD) into a Date object.
 * Returns undefined if the string is not a valid ISO date.
 */
function isoToDate(iso: string): Date | undefined {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const d = new Date(year, month - 1, day);
  if (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  ) {
    return d;
  }
  return undefined;
}

/**
 * Format a Date object into ISO YYYY-MM-DD.
 */
function dateToIso(d: Date): string {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Auto-format a raw input string with dd/mm/yyyy slash insertion.
 */
function autoFormatEuropean(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, '');
  if (digitsOnly.length > 8) return raw;
  const parts: string[] = [];
  if (digitsOnly.length > 0) parts.push(digitsOnly.slice(0, 2));
  if (digitsOnly.length > 2) parts.push(digitsOnly.slice(2, 4));
  if (digitsOnly.length > 4) parts.push(digitsOnly.slice(4, 8));
  return parts.join('/');
}

export function DateInput({
  value,
  onChange,
  hasError = false,
  id,
  placeholder = 'dd/mm/yyyy',
}: DateInputProps) {
  const [display, setDisplay] = useState(() => isoToEuropean(value));
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep display in sync when value changes externally
  useEffect(() => {
    setDisplay(isoToEuropean(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = autoFormatEuropean(e.target.value);
    setDisplay(formatted);

    if (isValidEuropeanDate(formatted)) {
      onChange(europeanToIso(formatted));
    } else if (formatted === '') {
      onChange('');
    }
  };

  const handleDaySelect = (day: Date | undefined) => {
    if (day) {
      const iso = dateToIso(day);
      onChange(iso);
      setDisplay(isoToEuropean(iso));
    }
    setOpen(false);
  };

  const selectedDate = isoToDate(value);

  const inputClass = hasError
    ? 'date-input-field date-input-field-error'
    : 'date-input-field';

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="date-input-wrapper">
        <input
          ref={inputRef}
          id={id}
          className={inputClass}
          type="text"
          value={display}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={10}
        />
        <Popover.Trigger asChild>
          <button
            className="date-input-trigger"
            type="button"
            aria-label="Open calendar"
          >
            <CalendarIcon />
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal>
        <Popover.Content
          className="date-input-popover"
          sideOffset={4}
          align="start"
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDaySelect}
            defaultMonth={selectedDate}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="16"
        y1="2"
        x2="16"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="2"
        x2="8"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="10"
        x2="21"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
