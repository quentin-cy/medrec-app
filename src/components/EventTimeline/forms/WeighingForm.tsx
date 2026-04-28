import { useState, useContext } from 'react';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { WeighingEvent } from '../../../types/schema.ts';
import '../../FormBlocks/event-form.css';

interface WeighingFormProps {
  onDone: () => void;
}

export function WeighingForm({ onDone }: WeighingFormProps) {
  const { medicalRecord, updateMedicalRecord } = useContext(MedRecContext);
  const [dateInput, setDateInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!medicalRecord) return null;

  const handleAdd = () => {
    if (!dateInput) {
      setFormError('Enter a valid date (dd/mm/yyyy)');
      return;
    }
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      setFormError('Enter a positive weight');
      return;
    }

    const entry: WeighingEvent = {
      id: generateId(),
      date: dateInput,
      eventType: 'weighing',
      weight_kg: weight,
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
      <input
        className="event-form-input"
        type="number"
        step="0.1"
        min="0"
        placeholder="Weight (kg)"
        value={weightInput}
        onChange={e => {
          setWeightInput(e.target.value);
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
