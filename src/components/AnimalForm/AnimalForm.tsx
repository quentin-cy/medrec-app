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
import styles from './AnimalForm.module.css';

const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'horse', label: 'Horse' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'bird', label: 'Bird' },
  { value: 'reptile', label: 'Reptile' },
  { value: 'other', label: 'Other' },
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
    errorFor(field) ? `${styles.input} ${styles.inputError}` : styles.input;

  return (
    <form className={styles.form} onSubmit={e => e.preventDefault()}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="name">
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
              <span className={styles.error}>{errorFor('name')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="species">
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
              <span className={styles.error}>{errorFor('species')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="breed">
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
              <span className={styles.error}>{errorFor('breed')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="sex">
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
              <span className={styles.error}>{errorFor('sex')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="dateOfBirth">
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
              <span className={styles.error}>{errorFor('dateOfBirth')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="weight">
              Weight (kg)
            </Label.Root>
            <input
              id="weight"
              className={fieldClass('weight')}
              type="number"
              step="0.1"
              min="0"
              value={animal.weight ?? ''}
              onChange={handleChange('weight')}
              placeholder="0.0"
            />
            {errorFor('weight') && (
              <span className={styles.error}>{errorFor('weight')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="microchipId">
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
              <span className={styles.error}>{errorFor('microchipId')}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Owner Information</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="ownerName">
              Owner Name
            </Label.Root>
            <input
              id="ownerName"
              className={fieldClass('ownerName')}
              type="text"
              value={animal.ownerName}
              onChange={handleChange('ownerName')}
              placeholder="Owner name"
            />
            {errorFor('ownerName') && (
              <span className={styles.error}>{errorFor('ownerName')}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label.Root className={styles.label} htmlFor="ownerPhone">
              Owner Phone
            </Label.Root>
            <input
              id="ownerPhone"
              className={fieldClass('ownerPhone')}
              type="tel"
              value={animal.ownerPhone}
              onChange={handleChange('ownerPhone')}
              placeholder="Phone number"
            />
            {errorFor('ownerPhone') && (
              <span className={styles.error}>{errorFor('ownerPhone')}</span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
