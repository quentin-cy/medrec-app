import * as SelectPrimitive from '@radix-ui/react-select';
import './Select.css';
import { CheckIcon, ChevronDownIcon } from '../icons/icons.tsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  hasError?: boolean;
}
export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  label,
  hasError = false,
}: SelectProps) {
  const triggerClass = hasError
    ? 'select-trigger select-trigger-error'
    : 'select-trigger';

  return (
    <div className="select-wrapper">
      {label && <label className="select-label">{label}</label>}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger className={triggerClass}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon className="select-icon">
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="select-content"
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="select-viewport">
              {options.map(option => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="select-item"
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="select-item-indicator">
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

