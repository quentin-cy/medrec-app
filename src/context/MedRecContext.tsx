import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AnimalRecord } from '../types/schema';

interface MedRecContextValue {
  animal: AnimalRecord | null;
  setAnimal: (animal: AnimalRecord | null) => void;
  updateAnimal: (updates: Partial<AnimalRecord>) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const MedRecContext = createContext<MedRecContextValue | undefined>(undefined);

export function MedRecProvider({ children }: { children: ReactNode }) {
  const [animal, setAnimalState] = useState<AnimalRecord | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const setAnimal = useCallback((animal: AnimalRecord | null) => {
    setAnimalState(animal);
    setHasUnsavedChanges(false);
  }, []);

  const updateAnimal = useCallback((updates: Partial<AnimalRecord>) => {
    setAnimalState(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
    setHasUnsavedChanges(true);
  }, []);

  return (
    <MedRecContext.Provider
      value={{
        animal,
        setAnimal,
        updateAnimal,
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
