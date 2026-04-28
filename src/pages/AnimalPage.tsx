import { useNavigate } from 'react-router-dom';
import { GeneralInformation } from '../components/FormBlocks/GeneralInformation/GeneralInformation.tsx';
import { EventTimeline } from '../components/EventTimeline/EventTimeline.tsx';
import { AnimalRecordSchema } from '../types/schema';
import { useEffect, useState, useCallback, useContext } from 'react';
import './AnimalPage.css';
import { useFileExport } from '../hooks/useFileExport';
import { MedRecContext } from '../context/MedRecContext.tsx';
import { ToastContext } from '../components/common/Toast/ToastContext.tsx';
import { SaveIcon } from '../components/common/icons/icons.tsx';
import { IconButton } from '../components/common/IconButton/IconButton.tsx';

export type FieldErrors = Record<string, string>;

export function AnimalPage() {
  const { medicalRecord } = useContext(MedRecContext);
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { exportFile, canExport } = useFileExport();

  const handleExport = () => {
    try {
      if (validate()) {
        exportFile();
        toast.success('Exported', 'Medical record downloaded successfully');
      }
    } catch {
      toast.error('Export failed', 'Could not export the medical record');
    }
  };

  useEffect(() => {
    if (!medicalRecord) {
      navigate('/');
    }
  }, [medicalRecord, navigate]);

  const validate = useCallback((): boolean => {
    if (!medicalRecord) return false;

    const result = AnimalRecordSchema.safeParse(medicalRecord);

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
    return result.success;
  }, [medicalRecord, toast]);

  if (!medicalRecord) return null;

  return (
    <div className="animal-page">
      <div className="animal-page-header">
        <div className="animal-page-header-left">
          <h1 className="animal-page-title">
            {medicalRecord.name || 'New Animal'}
          </h1>
          {medicalRecord.species && (
            <span className="animal-page-badge">{medicalRecord.species}</span>
          )}
        </div>
        <div className="animal-page-header-right">
          <div className="animal-page-actions">
            {canExport && (
              <IconButton
                icon={<SaveIcon />}
                text="Export Record"
                callback={handleExport}
              />
            )}
          </div>
        </div>
      </div>
      <GeneralInformation
        fieldErrors={fieldErrors}
        onClearError={field =>
          setFieldErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
          })
        }
      />
      <EventTimeline />
    </div>
  );
}
