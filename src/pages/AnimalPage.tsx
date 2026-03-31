import { useNavigate } from 'react-router-dom';
import { AnimalForm } from '../components/AnimalForm/AnimalForm';
import { useMedRec } from '../context/MedRecContext';
import { useToast } from '../components/ui/Toast/Toast';
import { AnimalSchema } from '../types/schema';
import { useEffect, useState, useCallback } from 'react';
import styles from './AnimalPage.module.css';

export type FieldErrors = Record<string, string>;

export function AnimalPage() {
  const { animal } = useMedRec();
  const navigate = useNavigate();
  const toast = useToast();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!animal) {
      navigate('/');
    }
  }, [animal, navigate]);

  const handleValidate = useCallback(() => {
    if (!animal) return;

    const result = AnimalSchema.safeParse(animal);

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
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{animal.name || 'New Animal'}</h1>
          {animal.species && (
            <span className={styles.badge}>{animal.species}</span>
          )}
        </div>
        <button className={styles.validateBtn} onClick={handleValidate}>
          <CheckIcon />
          Validate
        </button>
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
