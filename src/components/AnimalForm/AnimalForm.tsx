import { useState } from 'react';
import * as Label from '@radix-ui/react-label';
import { Select } from '../ui/Select/Select';
import { useMedRec } from '../../context/MedRecContext';
import {
  isoToEuropean,
  europeanToIso,
  isValidEuropeanDate,
} from '../../lib/utils';
import type { FieldErrors } from '../../pages/AnimalPage';
import './AnimalForm.css';

const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'horse', label: 'Horse' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'bird', label: 'Bird' },
  { value: 'reptile', label: 'Reptile' },
];

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' },
];

interface AnimalFormProps {
  fieldErrors?: FieldErrors;
  onClearError?: (field: string) => void;
}

export function AnimalForm({
  fieldErrors = {},
  onClearError,
}: AnimalFormProps) {
  const { animal, updateAnimal } = useMedRec();
  const [dateDisplay, setDateDisplay] = useState(() =>
    animal ? isoToEuropean(animal.dateOfBirth) : '',
  );

  if (!animal) return null;

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'weight'
          ? e.target.value === ''
            ? null
            : Number(e.target.value)
          : e.target.value;
      updateAnimal({ [field]: value });
      onClearError?.(field);
    };

  const handleSelectChange = (field: string, value: string) => {
    updateAnimal({ [field]: value });
    onClearError?.(field);
  };

  const errorFor = (field: string) => fieldErrors[field];
  const fieldClass = (field: string) =>
    errorFor(field)
      ? 'animal-form-input animal-form-input-error'
      : 'animal-form-input';

  return (
    <form className="animal-form" onSubmit={e => e.preventDefault()}>
      <div className="animal-form-section">
        <h3 className="animal-form-section-title">Basic Information</h3>
        <div className="animal-form-grid">
          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="name">
              Name
            </Label.Root>
            <input
              id="name"
              className={fieldClass('name')}
              type="text"
              value={animal.name}
              onChange={handleChange('name')}
              placeholder="Animal name"
            />
            {errorFor('name') && (
              <span className="animal-form-error">{errorFor('name')}</span>
            )}
          </div>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="species">
              Species
            </Label.Root>
            <Select
              value={animal.species}
              onValueChange={value => handleSelectChange('species', value)}
              options={SPECIES_OPTIONS}
              placeholder="Select species"
              hasError={!!errorFor('species')}
            />
            {errorFor('species') && (
              <span className="animal-form-error">{errorFor('species')}</span>
            )}
          </div>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="breed">
              Breed
            </Label.Root>
            <input
              id="breed"
              className={fieldClass('breed')}
              type="text"
              value={animal.breed}
              onChange={handleChange('breed')}
              placeholder="Breed"
            />
            {errorFor('breed') && (
              <span className="animal-form-error">{errorFor('breed')}</span>
            )}
          </div>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="sex">
              Sex
            </Label.Root>
            <Select
              value={animal.sex}
              onValueChange={value => handleSelectChange('sex', value)}
              options={SEX_OPTIONS}
              placeholder="Select sex"
              hasError={!!errorFor('sex')}
            />
            {errorFor('sex') && (
              <span className="animal-form-error">{errorFor('sex')}</span>
            )}
          </div>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="dateOfBirth">
              Date of Birth
            </Label.Root>
            <input
              id="dateOfBirth"
              className={fieldClass('dateOfBirth')}
              type="text"
              value={dateDisplay}
              onChange={e => {
                let value = e.target.value;

                // Auto-insert slashes as the user types digits
                const digitsOnly = value.replace(/\D/g, '');
                if (digitsOnly.length <= 8) {
                  const parts: string[] = [];
                  if (digitsOnly.length > 0) parts.push(digitsOnly.slice(0, 2));
                  if (digitsOnly.length > 2) parts.push(digitsOnly.slice(2, 4));
                  if (digitsOnly.length > 4) parts.push(digitsOnly.slice(4, 8));
                  value = parts.join('/');
                }

                setDateDisplay(value);
                onClearError?.('dateOfBirth');

                // Only update the animal state when we have a complete valid date
                if (isValidEuropeanDate(value)) {
                  updateAnimal({ dateOfBirth: europeanToIso(value) });
                } else if (value === '') {
                  updateAnimal({ dateOfBirth: '' });
                }
              }}
              onBlur={() => {
                // On blur, if the value is a complete valid date, normalize it
                if (isValidEuropeanDate(dateDisplay)) {
                  const iso = europeanToIso(dateDisplay);
                  updateAnimal({ dateOfBirth: iso });
                } else if (dateDisplay === '') {
                  updateAnimal({ dateOfBirth: '' });
                }
              }}
              placeholder="dd/mm/yyyy"
              maxLength={10}
            />
            {errorFor('dateOfBirth') && (
              <span className="animal-form-error">
                {errorFor('dateOfBirth')}
              </span>
            )}
          </div>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="microchipId">
              Microchip ID
            </Label.Root>
            <input
              id="microchipId"
              className={fieldClass('microchipId')}
              type="text"
              value={animal.microchipId ?? ''}
              onChange={e => {
                updateAnimal({ microchipId: e.target.value || null });
                onClearError?.('microchipId');
              }}
              placeholder="Optional"
            />
            {errorFor('microchipId') && (
              <span className="animal-form-error">
                {errorFor('microchipId')}
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
