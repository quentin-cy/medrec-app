import { useState, useMemo } from 'react';
import { useMedRec } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { Vaccination as VaccinationEntry } from '../../../types/schema.ts';
import './Vaccination.css';
import { DeleteIcon } from '../../common/icons/icons.tsx';
import { isoToEuropean } from '../../../utils/formatting.ts';

export function Vaccination() {
  const { animal, updateAnimal, context } = useMedRec();
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [vetInput, setVetInput] = useState('');
  const [formError, setFormError] = useState('');



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
  if (!animal) return null;
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