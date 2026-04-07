import { useState, useMemo } from 'react';
import { useMedRec } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { PestControl as PestControlEntry } from '../../../types/schema.ts';
import './PestControl.css';
import {DeleteIcon} from "../../common/icons/icons.tsx";
import { isoToEuropean } from '../../../utils/formatting.ts';

export function PestControl() {
  const { animal, updateAnimal, context } = useMedRec();
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [formError, setFormError] = useState('');

  const typeOptions = useMemo(
    () =>
      context.pest_control_types.map(t => ({
        value: String(t.value),
        label: t.label,
      })),
    [context.pest_control_types],
  );

  const typeLabels = useMemo(
    () =>
      Object.fromEntries(
        context.pest_control_types.map(t => [t.value, t.label]),
      ) as Record<number, string>,
    [context.pest_control_types],
  );

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
              options={typeOptions}
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
                <td>{typeLabels[entry.type] ?? entry.type}</td>
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


