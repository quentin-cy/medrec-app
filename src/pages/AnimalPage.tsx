import { useNavigate } from 'react-router-dom';
import { AnimalForm } from '../components/AnimalForm/AnimalForm';
import { WeightHistory } from '../components/WeightHistory/WeightHistory';
import { useMedRec } from '../context/MedRecContext';
import { useToast } from '../components/ui/Toast/Toast';
import { AnimalRecordSchema } from '../types/schema';
import { useEffect, useState, useCallback } from 'react';
import './AnimalPage.css';
import { useFileExport } from '../hooks/useFileExport';

export type FieldErrors = Record<string, string>;

export function AnimalPage() {
  const { animal } = useMedRec();
  const navigate = useNavigate();
  const toast = useToast();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { exportFile, canExport } = useFileExport();

  const handleExport = () => {
    try {
      exportFile();
      toast.success('Exported', 'Medical record downloaded successfully');
    } catch {
      toast.error('Export failed', 'Could not export the medical record');
    }
  };

  useEffect(() => {
    if (!animal) {
      navigate('/');
    }
  }, [animal, navigate]);

  const handleValidate = useCallback(() => {
    if (!animal) return;

    const result = AnimalRecordSchema.safeParse(animal);

    if (result.success) {
      setFieldErrors({});
      toast.success('Validation passed', 'All fields are valid');
    } else {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.');
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      const count = Object.keys(errors).length;
      toast.error(
        'Validation failed',
        `${count} field${count > 1 ? 's' : ''} need${count === 1 ? 's' : ''} attention`,
      );
    }
  }, [animal, toast]);

  if (!animal) return null;

  return (
    <div className="animal-page">
      <div className="animal-page-header">
        <div className="animal-page-header-left">
          <h1 className="animal-page-title">{animal.name || 'New Animal'}</h1>
          {animal.species && (
            <span className="animal-page-badge">{animal.species}</span>
          )}
        </div>
        <div className="animal-page-header-right">
          <button className="animal-page-validate-btn" onClick={handleValidate}>
            <CheckIcon />
            Validate
          </button>
          <div className="animal-page-actions">
            {canExport && (
              <button className="animal-page-export-btn" onClick={handleExport}>
                Export Record
              </button>
            )}
          </div>
        </div>
      </div>
      <AnimalForm
        fieldErrors={fieldErrors}
        onClearError={field =>
          setFieldErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
          })
        }
      />
      <WeightHistory />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
