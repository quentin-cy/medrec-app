import { useState, useMemo, useContext } from 'react';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { TextField } from '../../common/TextField/TextField.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { AppointmentEvent } from '../../../types/schema.ts';
import '../../FormBlocks/event-form.css';

interface AppointmentFormProps {
  onDone: () => void;
}

export function AppointmentForm({ onDone }: AppointmentFormProps) {
  const { medicalRecord, updateMedicalRecord, medicalContext } =
    useContext(MedRecContext);
  const [dateInput, setDateInput] = useState('');
  const [vetInput, setVetInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [formError, setFormError] = useState('');

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
    if (vetInput === '') {
      setFormError('Select a vet');
      return;
    }
    const price = priceInput ? parseFloat(priceInput) : 0;
    if (isNaN(price) || price < 0) {
      setFormError('Enter a valid price');
      return;
    }

    const entry: AppointmentEvent = {
      id: generateId(),
      date: dateInput,
      eventType: 'appointment',
      vet: Number(vetInput),
      comment: commentInput.trim(),
      price,
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
      <Select
        value={vetInput}
        onValueChange={value => {
          setVetInput(value);
          setFormError('');
        }}
        options={vetOptions}
        placeholder="Vet"
      />
      <TextField
        id="comment"
        value={commentInput}
        placeholder="Comment (optional)"
        onChange={e => {
          setCommentInput(e.target.value);
          setFormError('');
        }}
      />
      <input
        className="event-form-input"
        type="number"
        step="0.01"
        min="0"
        placeholder="Price"
        value={priceInput}
        onChange={e => {
          setPriceInput(e.target.value);
          setFormError('');
        }}
      />
      <button className="event-form-confirm" onClick={handleAdd}>
        Add
      </button>
      {formError && <span className="event-form-error">{formError}</span>}
    </div>
  );
}
