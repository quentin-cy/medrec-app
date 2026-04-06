import { useState } from 'react';
import { useMedRec } from '../../context/MedRecContext';
import { Select } from '../ui/Select/Select';
import { DateInput } from '../ui/DateInput/DateInput';
import { generateId, isoToEuropean } from '../../lib/utils';
import type { PestControl as PestControlEntry } from '../../types/schema';
import './PestControl.css';

const TYPE_OPTIONS = [
  { value: '0', label: 'Dewormer' },
  { value: '1', label: 'Flea Protection' },
];

const TYPE_LABELS: Record<number, string> = {
  0: 'Dewormer',
  1: 'Flea Protection',
};

export function PestControl() {
  const { animal, updateAnimal } = useMedRec();
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!animal) return null;

  const entries = [...animal.pest_control_history].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

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

    const entry: PestControlEntry = {
      id: generateId(),
      date: dateInput,
      type: Number(typeInput) as 0 | 1,
      reference: referenceInput.trim(),
      comment: commentInput.trim(),
    };

    updateAnimal({
      pest_control_history: [...animal.pest_control_history, entry],
    });

    setDateInput('');
    setTypeInput('');
    setReferenceInput('');
    setCommentInput('');
    setFormError('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateAnimal({
      pest_control_history: animal.pest_control_history.filter(
        e => e.id !== id,
      ),
    });
  };

  return (
    <div className="pest-control">
      <div className="pest-control-header">
        <h3 className="pest-control-title">Pest Control</h3>
        <button
          className="pest-control-add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="pest-control-form">
          <DateInput
            value={dateInput}
            onChange={iso => {
              setDateInput(iso);
              setFormError('');
            }}
          />
          <div className="pest-control-form-select">
            <Select
              value={typeInput}
              onValueChange={value => {
                setTypeInput(value);
                setFormError('');
              }}
              options={TYPE_OPTIONS}
              placeholder="Type"
            />
          </div>
          <input
            className="pest-control-form-input pest-control-form-input-ref"
            type="text"
            placeholder="Product / reference"
            value={referenceInput}
            onChange={e => {
              setReferenceInput(e.target.value);
              setFormError('');
            }}
          />
          <input
            className="pest-control-form-input pest-control-form-input-comment"
            type="text"
            placeholder="Comment (optional)"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
          />
          <button className="pest-control-form-confirm" onClick={handleAdd}>
            Add
          </button>
          {formError && (
            <span className="pest-control-form-error">{formError}</span>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="pest-control-empty">
          No pest control entries yet. Add one to start tracking.
        </p>
      ) : (
        <table className="pest-control-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Reference</th>
              <th>Comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{isoToEuropean(entry.date)}</td>
                <td>{TYPE_LABELS[entry.type] ?? entry.type}</td>
                <td>{entry.reference}</td>
                <td className="pest-control-comment">
                  {entry.comment || '--'}
                </td>
                <td>
                  <button
                    className="pest-control-delete-btn"
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
