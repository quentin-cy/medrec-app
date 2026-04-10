import * as Label from '@radix-ui/react-label';
import { Select } from '../../common/Select/Select.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import type { FieldErrors } from '../../../pages/AnimalPage.tsx';
import './GeneralInformation.css';
import { useContext } from 'react';
import { FormSection } from '../../FormSection/FormSection.tsx';
import { TextField } from '../../common/TextField/TextField.tsx';

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

export function GeneralInformation({
  fieldErrors = {},
  onClearError,
}: AnimalFormProps) {
  const { medicalRecord, updateMedicalRecord } = useContext(MedRecContext);

  if (!medicalRecord) return null;

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateMedicalRecord({ [field]: e.target.value });
      onClearError?.(field);
    };

  const handleSelectChange = (field: string, value: string) => {
    updateMedicalRecord({ [field]: value });
    onClearError?.(field);
  };

  const errorFor = (field: string) => fieldErrors[field];

  return (
    <form className="animal-form" onSubmit={e => e.preventDefault()}>
      <FormSection title="General Information">
        <div className="animal-form-grid">
          <TextField
            id="name"
            label="Name"
            value={medicalRecord.name}
            placeholder="Animal name"
            onChange={handleChange('name')}
            error={errorFor('name')}
          ></TextField>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="species">
              Species
            </Label.Root>
            <Select
              value={medicalRecord.species}
              onValueChange={value => handleSelectChange('species', value)}
              options={SPECIES_OPTIONS}
              placeholder="Select species"
              hasError={!!errorFor('species')}
            />
            {errorFor('species') && (
              <span className="animal-form-error">{errorFor('species')}</span>
            )}
          </div>

          <TextField
            id="breed"
            label="Breed"
            value={medicalRecord.breed}
            placeholder="Animal breed"
            onChange={handleChange('breed')}
            error={errorFor('breed')}
          ></TextField>

          <div className="animal-form-field">
            <Label.Root className="animal-form-label" htmlFor="sex">
              Sex
            </Label.Root>
            <Select
              value={medicalRecord.sex}
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
            <DateInput
              id="dateOfBirth"
              value={medicalRecord.dateOfBirth}
              onChange={iso => {
                updateMedicalRecord({ dateOfBirth: iso });
                onClearError?.('dateOfBirth');
              }}
              hasError={!!errorFor('dateOfBirth')}
            />
            {errorFor('dateOfBirth') && (
              <span className="animal-form-error">
                {errorFor('dateOfBirth')}
              </span>
            )}
          </div>

          <TextField
            id="microchipId"
            label="Microchip ID"
            value={medicalRecord.microchipId}
            placeholder="Optional"
            onChange={handleChange('microchipId')}
            error={errorFor('microchipId')}
          ></TextField>
        </div>
      </FormSection>
    </form>
  );
}
