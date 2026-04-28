import { useState, useMemo, useContext } from 'react';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { AppointmentEvent } from '../../../types/schema.ts';
import '../event-form.css';
import { DeleteIcon, PlusIcon } from '../../common/icons/icons.tsx';
import { isoToEuropean } from '../../../utils/formatting.ts';
import { SmallIconButton } from '../../common/IconButton/IconButton.tsx';
import { FormSection } from '../../FormSection/FormSection.tsx';
import { TextField } from '../../common/TextField/TextField.tsx';
import { Modal } from '../../common/Modal/Modal.tsx';

export function Appointment() {
  const { medicalRecord, updateMedicalRecord, medicalContext } =
    useContext(MedRecContext);
  const [showForm, setShowForm] = useState(false);
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

  const vetLabels = useMemo(
    () =>
      Object.fromEntries(
        medicalContext.vets.map(v => [v.value, formatVetDisplay(v)]),
      ) as Record<number, string>,
    [medicalContext.vets],
  );

  if (!medicalRecord) return null;

  const entries = medicalRecord.events
    .filter((e): e is AppointmentEvent => e.eventType === 'appointment')
    .sort((a, b) => b.date.localeCompare(a.date));

  const resetForm = () => {
    setDateInput('');
    setVetInput('');
    setCommentInput('');
    setPriceInput('');
    setFormError('');
  };

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

    resetForm();
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateMedicalRecord({
      events: medicalRecord.events.filter(e => e.id !== id),
    });
  };

  return (
    <FormSection
      title="Appointments"
      button={
        <SmallIconButton
          icon={<PlusIcon />}
          text="Add Entry"
          callback={() => {
            resetForm();
            setShowForm(true);
          }}
        />
      }
    >
      <Modal
        open={showForm}
        onOpenChange={open => {
          setShowForm(open);
          if (!open) resetForm();
        }}
        title="Add Appointment"
      >
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
            className="event-form-input event-form-input-short"
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
      </Modal>

      {entries.length === 0 ? (
        <p className="event-empty">
          No appointment entries yet. Add one to start tracking.
        </p>
      ) : (
        <table className="event-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vet</th>
              <th>Comment</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{isoToEuropean(entry.date)}</td>
                <td>{vetLabels[entry.vet] ?? entry.vet}</td>
                <td className="event-table-muted">{entry.comment || '--'}</td>
                <td>{entry.price > 0 ? `${entry.price.toFixed(2)}` : '--'}</td>
                <td>
                  <button
                    className="event-delete-btn"
                    onClick={() => handleDelete(entry.id)}
                    title="Delete entry"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </FormSection>
  );
}
