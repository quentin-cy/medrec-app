import { useState, useMemo, useContext } from 'react';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { TextField } from '../../common/TextField/TextField.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { PestControlEvent } from '../../../types/schema.ts';
import '../../FormBlocks/event-form.css';

interface PestControlFormProps {
  onDone: () => void;
}

export function PestControlForm({ onDone }: PestControlFormProps) {
  const { medicalRecord, updateMedicalRecord, medicalContext } =
    useContext(MedRecContext);
  const [dateInput, setDateInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [formError, setFormError] = useState('');

  const typeOptions = useMemo(
    () =>
      medicalContext.pest_control_types.map(t => ({
        value: String(t.value),
        label: t.label,
      })),
    [medicalContext.pest_control_types],
  );

  if (!medicalRecord) return null;

  const handleAdd = () => {
    if (!dateInput) {
      setFormError('Enter a valid date (dd/mm/yyyy)');
      return;
    }
    if (typeInput === '') {
      setFormError('Select a type');
      return;
    }
    if (!referenceInput.trim()) {
      setFormError('Enter a reference (product name)');
      return;
    }

    const entry: PestControlEvent = {
      id: generateId(),
      date: dateInput,
      eventType: 'pest_control',
      type: Number(typeInput) as 0 | 1,
      reference: referenceInput.trim(),
      comment: commentInput.trim(),
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
        value={typeInput}
        onValueChange={value => {
          setTypeInput(value);
          setFormError('');
        }}
        options={typeOptions}
        placeholder="Type"
      />
      <TextField
        id="reference"
        value={referenceInput}
        placeholder="Product reference"
        onChange={e => {
          setReferenceInput(e.target.value);
          setFormError('');
        }}
      />
      <TextField
        id="comment"
        value={commentInput}
        placeholder="Comment (optional)"
        onChange={e => setCommentInput(e.target.value)}
      />
      <button className="event-form-confirm" onClick={handleAdd}>
        Add
      </button>
      {formError && <span className="event-form-error">{formError}</span>}
    </div>
  );
}
