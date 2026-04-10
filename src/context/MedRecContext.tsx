import {
  createContext,
} from 'react';
import type { AnimalRecord } from '../types/schema';
import type { MedicalContext } from '../types/medicalContext.ts';

interface MedRecContext {
  medicalRecord: AnimalRecord | null;
  initAnimal: (animal: AnimalRecord | null) => void;
  updateMedicalRecord: (updates: Partial<AnimalRecord>) => void;
  recordVersion: number;
  setRecordVersion: (version: number) => void;
  medicalContext: MedicalContext;
  setMedicalContext: (context: MedicalContext) => void;
  updateMedicalContext: (updates: Partial<MedicalContext>) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const EmptyMedRecContext: MedRecContext = {
  medicalRecord: null,
  initAnimal: () => {},
  updateMedicalRecord: () => {},
  recordVersion: 0,
  setRecordVersion: () => {},
  medicalContext: {
    pest_control_types: [],
    vaccination_types: [],
    vets: [],
  },
  setMedicalContext: () => {},
  updateMedicalContext: () => {},
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
};

export const MedRecContext = createContext<MedRecContext>(EmptyMedRecContext);