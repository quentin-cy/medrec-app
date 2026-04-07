import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AnimalRecord, Context } from '../types/schema';

interface MedRecContextValue {
  animal: AnimalRecord | null;
  setAnimal: (animal: AnimalRecord | null) => void;
  updateAnimal: (updates: Partial<AnimalRecord>) => void;
  version: number;
  setVersion: (version: number) => void;
  context: Context;
  setContext: (context: Context) => void;
  updateContext: (updates: Partial<Context>) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const DEFAULT_CONTEXT: Context = {
  pest_control_types: [
    { value: 0, label: 'Dewormer' },
    { value: 1, label: 'Flea Protection' },
  ],
  vaccination_types: [
    { value: 0, label: 'Rabies' },
    { value: 1, label: 'DHPP' },
    { value: 2, label: 'Bordetella' },
  ],
  vets: [{ value: 0, name: 'Dr. Smith', practice: '' }],
};

const MedRecContext = createContext<MedRecContextValue | undefined>(undefined);

export function MedRecProvider({ children }: { children: ReactNode }) {
  const [animal, setAnimalState] = useState<AnimalRecord | null>(null);
  const [version, setVersion] = useState(0);
  const [context, setContext] = useState<Context>(DEFAULT_CONTEXT);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const setAnimal = useCallback((animal: AnimalRecord | null) => {
    setAnimalState(animal);
    setVersion(0);
    setContext(DEFAULT_CONTEXT);
    setHasUnsavedChanges(false);
  }, []);

  const updateAnimal = useCallback((updates: Partial<AnimalRecord>) => {
    setAnimalState(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
    setHasUnsavedChanges(true);
  }, []);

  const updateContext = useCallback((updates: Partial<Context>) => {
    setContext(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  return (
    <MedRecContext.Provider
      value={{
        animal,
        setAnimal,
        updateAnimal,
        version,
        setVersion,
        context,
        setContext,
        updateContext,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
      {children}
    </MedRecContext.Provider>
  );
}

export function useMedRec(): MedRecContextValue {
  const context = useContext(MedRecContext);
  if (!context) {
    throw new Error('useMedRec must be used within a MedRecProvider');
  }
  return context;
}
