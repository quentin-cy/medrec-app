import { useState } from 'react';
import { useMedRec } from '../../context/MedRecContext';
import {
  generateId,
  europeanToIso,
  isoToEuropean,
  isValidEuropeanDate,
} from '../../lib/utils';
import type { Weighing } from '../../types/schema';
import './WeightHistory.css';

export function WeightHistory() {
  const { animal, updateAnimal } = useMedRec();
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!animal) return null;

  const entries = [...animal.weight_history].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const handleDateChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 8) {
      const parts: string[] = [];
      if (digitsOnly.length > 0) parts.push(digitsOnly.slice(0, 2));
      if (digitsOnly.length > 2) parts.push(digitsOnly.slice(2, 4));
      if (digitsOnly.length > 4) parts.push(digitsOnly.slice(4, 8));
      value = parts.join('/');
    }
    setDateInput(value);
    setFormError('');
  };

  const handleAdd = () => {
    if (!isValidEuropeanDate(dateInput)) {
      setFormError('Enter a valid date (dd/mm/yyyy)');
      return;
    }

    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      setFormError('Enter a positive weight');
      return;
    }

    const entry: Weighing = {
      id: generateId(),
      date: europeanToIso(dateInput),
      weight_kg: weight,
    };

    updateAnimal({
      weight_history: [...animal.weight_history, entry],
    });

    setDateInput('');
    setWeightInput('');
    setFormError('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateAnimal({
      weight_history: animal.weight_history.filter(w => w.id !== id),
    });
  };

  return (
    <div className="weight-history">
      <div className="weight-history-header">
        <h3 className="weight-history-title">Weight History</h3>
        <button
          className="weight-history-add-btn"
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
        >
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {showForm && (
        <div className="weight-history-form">
          <input
            className="weight-history-form-input"
            type="text"
            placeholder="dd/mm/yyyy"
            value={dateInput}
            onChange={e => handleDateChange(e.target.value)}
            maxLength={10}
          />
          <input
            className="weight-history-form-input weight-history-form-input-weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="kg"
            value={weightInput}
            onChange={e => {
              setWeightInput(e.target.value);
              setFormError('');
            }}
          />
          <button className="weight-history-form-confirm" onClick={handleAdd}>
            Add
          </button>
          {formError && (
            <span className="weight-history-form-error">{formError}</span>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="weight-history-empty">
          No weight entries yet. Add one to start tracking.
        </p>
      ) : (
        <>
          {entries.length >= 2 && <WeightChart entries={entries} />}
          <table className="weight-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weight (kg)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td>{isoToEuropean(entry.date)}</td>
                  <td>{entry.weight_kg}</td>
                  <td>
                    <button
                      className="weight-history-delete-btn"
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
        </>
      )}
    </div>
  );
}

function WeightChart({ entries }: { entries: Weighing[] }) {
  // Sort chronologically for the chart (oldest first)
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const weights = sorted.map(e => e.weight_kg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const rangeW = maxW - minW || 1;

  // Chart dimensions
  const width = 500;
  const height = 200;
  const padX = 50;
  const padY = 30;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = sorted.map((entry, i) => {
    const x =
      padX +
      (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW);
    const y = padY + chartH - ((entry.weight_kg - minW) / rangeW) * chartH;
    return { x, y, entry };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  // Y-axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = minW + (rangeW * i) / 4;
    const y = padY + chartH - ((val - minW) / rangeW) * chartH;
    return { val: val.toFixed(1), y };
  });

  return (
    <div className="weight-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="weight-chart-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padX}
              y1={tick.y}
              x2={width - padX}
              y2={tick.y}
              className="weight-chart-grid"
            />
            <text
              x={padX - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="weight-chart-label"
            >
              {tick.val}
            </text>
          </g>
        ))}

        {/* Line */}
        <polyline points={polyline} fill="none" className="weight-chart-line" />

        {/* Dots and x-labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" className="weight-chart-dot" />
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="weight-chart-label"
            >
              {isoToEuropean(p.entry.date).slice(0, 5)}
            </text>
          </g>
        ))}
      </svg>
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
