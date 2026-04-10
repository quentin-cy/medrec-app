import type { MedicalContext } from '../types/medicalContext.ts';
import {
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AnimalRecord } from '../types/schema.ts';
import { MedRecContext } from './MedRecContext.tsx';

const DEFAULT_MEDICAL_CONTEXT: MedicalContext = {
  pest_control_types: [
    { value: 0, label: 'Dewormer' },
  ],
  vaccination_types: [
    { value: 0, label: 'Rabies' },
  ],
  vets: [{ value: 0, name: 'Dr. Smith', practice: '' }],
};

export function MedRecContextProvider({ children }: { children: ReactNode }) {
  const [medicalRecord, setMedicalRecord] = useState<AnimalRecord | null>(null);
  const [recordVersion, setRecordVersion] = useState(0);
  const [medicalContext, setMedicalContext] = useState<MedicalContext>(DEFAULT_MEDICAL_CONTEXT);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const initAnimal = useCallback((record: AnimalRecord | null) => {
    setMedicalRecord(record);
    setRecordVersion(0);
    setMedicalContext(DEFAULT_MEDICAL_CONTEXT);
    setHasUnsavedChanges(false);
  }, []);

  const updateMedicalRecord = useCallback((updates: Partial<AnimalRecord>) => {
    setMedicalRecord(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
    setHasUnsavedChanges(true);
  }, []);

  const updateMedicalContext = useCallback((updates: Partial<MedicalContext>) => {
    setMedicalContext(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  return (
    <MedRecContext.Provider
      value={{
        medicalRecord,
        initAnimal,
        updateMedicalRecord,
        recordVersion,
        setRecordVersion,
        medicalContext,
        setMedicalContext,
        updateMedicalContext,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
      {children}
    </MedRecContext.Provider>
  );
}