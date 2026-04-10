import './FormSection.css';
import type { ReactNode } from 'react';

interface FormSectionProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  button?: ReactNode;
}

export function FormSection({
  children,
  title,
  subtitle,
  button,
}: FormSectionProps) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div>
          <h3 className="form-section-title">{title}</h3>
          <h4 className="form-section-subtitle">{subtitle}</h4>
        </div>
        <div>{button}</div>
      </div>
      {children}
    </div>
  );
}
