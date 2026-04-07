import { useState, useMemo } from 'react';
import { useMedRec } from '../../context/MedRecContext';
import { Select } from '../ui/Select/Select';
import { DateInput } from '../ui/DateInput/DateInput';
import { generateId, isoToEuropean } from '../../lib/utils';
import type { Vaccination as VaccinationEntry } from '../../types/schema';
import './Vaccination.css';

export function Vaccination() {
  const { animal, updateAnimal, context } = useMedRec();
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [vetInput, setVetInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!animal) return null;

  const typeOptions = useMemo(
    () =>
      context.vaccination_types.map(t => ({
        value: String(t.value),
        label: t.label,
      })),
    [context.vaccination_types],
  );

  const typeLabels = useMemo(
    () =>
      Object.fromEntries(
        context.vaccination_types.map(t => [t.value, t.label]),
      ) as Record<number, string>,
    [context.vaccination_types],
  );

  const formatVetDisplay = (v: { name: string; practice: string }) =>
    v.practice ? `${v.name} (${v.practice})` : v.name;

  const vetOptions = useMemo(
    () =>
      context.vets.map(v => ({
        value: String(v.value),
        label: formatVetDisplay(v),
      })),
    [context.vets],
  );

  const vetLabels = useMemo(
    () =>
      Object.fromEntries(
        context.vets.map(v => [v.value, formatVetDisplay(v)]),
      ) as Record<number, string>,
    [context.vets],
  );

  const entries = [...animal.vaccination_history].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const handleAdd = () => {
    if (!dateInput) {
      setFormError('Enter a valid date (dd/mm/yyyy)');
      return;
    }

    if (typeInput === '') {
      setFormError('Select a vaccination type');
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

    const entry: VaccinationEntry = {
      id: generateId(),
      date: dateInput,
      type: Number(typeInput),
      reference: referenceInput.trim(),
      vet: Number(vetInput),
    };

    updateAnimal({
      vaccination_history: [...animal.vaccination_history, entry],
    });

    setDateInput('');
    setTypeInput('');
    setReferenceInput('');
    setVetInput('');
    setFormError('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateAnimal({
      vaccination_history: animal.vaccination_history.filter(e => e.id !== id),
    });
  };

  return (
    <div className="vaccination">
      <div className="vaccination-header">
        <h3 className="vaccination-title">Vaccinations</h3>
        <button
          className="vaccination-add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="vaccination-form">
          <DateInput
            value={dateInput}
            onChange={iso => {
              setDateInput(iso);
              setFormError('');
            }}
          />
          <div className="vaccination-form-select">
            <Select
              value={typeInput}
              onValueChange={value => {
                setTypeInput(value);
                setFormError('');
              }}
              options={typeOptions}
              placeholder="Type"
            />
          </div>
          <input
            className="vaccination-form-input vaccination-form-input-ref"
            type="text"
            placeholder="Vaccine / reference"
            value={referenceInput}
            onChange={e => {
              setReferenceInput(e.target.value);
              setFormError('');
            }}
          />
          <div className="vaccination-form-select">
            <Select
              value={vetInput}
              onValueChange={value => {
                setVetInput(value);
                setFormError('');
              }}
              options={vetOptions}
              placeholder="Vet"
            />
          </div>
          <button className="vaccination-form-confirm" onClick={handleAdd}>
            Add
          </button>
          {formError && (
            <span className="vaccination-form-error">{formError}</span>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="vaccination-empty">
          No vaccination entries yet. Add one to start tracking.
        </p>
      ) : (
        <table className="vaccination-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Reference</th>
              <th>Vet</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{isoToEuropean(entry.date)}</td>
                <td>{typeLabels[entry.type] ?? entry.type}</td>
                <td>{entry.reference}</td>
                <td>{vetLabels[entry.vet] ?? entry.vet}</td>
                <td>
                  <button
                    className="vaccination-delete-btn"
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
    </div>
  );
}

function DeleteIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6H5H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
