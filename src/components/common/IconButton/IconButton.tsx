import type { ReactNode } from 'react';
import './IconButton.css';

interface FormSectionProps {
  icon: ReactNode;
  text: string;
  callback?: () => void;
}

export function IconButton({ icon, text, callback}: FormSectionProps) {
  return (
    <button className="icon-button" onClick={callback}>
      {icon}
      <span className="icon-button-text">{text}</span>
    </button>
  );
}

export function SmallIconButton({ icon, text, callback}: FormSectionProps) {
  return (
    <button className="icon-button-sm" onClick={callback}>
      {icon}
      <span className="icon-button-text">{text}</span>
    </button>
  );
}