import { v4 as uuidv4 } from 'uuid';
import type { AnimalRecord } from '../types/schema';

export function generateId(): string {
  return uuidv4();
}

export function createBlankRecord(): AnimalRecord {
  return {
    id: generateId(),
    name: '',
    species: '',
    breed: '',
    dateOfBirth: '',
    sex: 'unknown',
    weight_history: [],
    pest_control_history: [],
    vaccination_history: [],
    microchipId: null,
  };
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
