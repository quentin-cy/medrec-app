import { useState, useMemo, useContext } from 'react';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { MultiSelect } from '../../common/MultiSelect/MultiSelect.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { TextField } from '../../common/TextField/TextField.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { VaccinationEvent } from '../../../types/schema.ts';
import '../../FormBlocks/event-form.css';

interface VaccinationFormProps {
  onDone: () => void;
}

export function VaccinationForm({ onDone }: VaccinationFormProps) {
  const { medicalRecord, updateMedicalRecord, medicalContext } =
    useContext(MedRecContext);
  const [dateInput, setDateInput] = useState('');
  const [typesInput, setTypesInput] = useState<string[]>([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [vetInput, setVetInput] = useState('');
  const [formError, setFormError] = useState('');

  const typeOptions = useMemo(
    () =>
      medicalContext.vaccination_types.map(t => ({
        value: String(t.value),
        label: t.label,
      })),
    [medicalContext.vaccination_types],
  );

  const formatVetDisplay = (v: { name: string; practice: string }) =>
    v.practice ? `${v.name} (${v.practice})` : v.name;

  const vetOptions = useMemo(
    () =>
      medicalContext.vets.map(v => ({
        value: String(v.value),
        label: formatVetDisplay(v),
      })),
    [medicalContext.vets],
  );

  if (!medicalRecord) return null;

  const handleAdd = () => {
    if (!dateInput) {
      setFormError('Enter a valid date (dd/mm/yyyy)');
      return;
    }
    if (typesInput.length === 0) {
      setFormError('Select at least one vaccination type');
      return;
    }
    if (!referenceInput.trim()) {
      setFormError('Enter a reference (vaccine name)');
      return;
    }
    if (vetInput === '') {
      setFormError('Select a vet');
      return;
    }

    const entry: VaccinationEvent = {
      id: generateId(),
      date: dateInput,
      eventType: 'vaccination',
      types: typesInput.map(Number),
      reference: referenceInput.trim(),
      vet: Number(vetInput),
    };

    updateMedicalRecord({
      events: [...medicalRecord.events, entry],
    });
    onDone();
  };

  return (
    <div className="event-form">
      <DateInput
        value={dateInput}
        onChange={iso => {
          setDateInput(iso);
          setFormError('');
        }}
      />
      <MultiSelect
        values={typesInput}
        onValuesChange={values => {
          setTypesInput(values);
          setFormError('');
        }}
        options={typeOptions}
        placeholder="Type(s)"
      />
      <TextField
        id="reference"
        value={referenceInput}
        placeholder="Reference"
        onChange={e => {
          setReferenceInput(e.target.value);
          setFormError('');
        }}
      />
      <Select
        value={vetInput}
        onValueChange={value => {
          setVetInput(value);
          setFormError('');
        }}
        options={vetOptions}
        placeholder="Vet"
      />
      <button className="event-form-confirm" onClick={handleAdd}>
        Add
      </button>
      {formError && <span className="event-form-error">{formError}</span>}
    </div>
  );
}
