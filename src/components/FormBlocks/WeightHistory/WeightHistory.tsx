import { useContext, useState } from 'react';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { Weighing } from '../../../types/schema.ts';
import './WeightHistory.css';
import { DeleteIcon } from '../../common/icons/icons.tsx';
import { isoToEuropean } from '../../../utils/formatting.ts';
import { MedRecContext } from '../../../context/MedRecContext.tsx';

export function WeightHistory() {
  const { medicalRecord, updateMedicalRecord } = useContext(MedRecContext);
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!medicalRecord) return null;

  const entries = [...medicalRecord.weight_history].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

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

    const entry: Weighing = {
      id: generateId(),
      date: dateInput,
      weight_kg: weight,
    };

    updateMedicalRecord({
      weight_history: [...medicalRecord.weight_history, entry],
    });

    setDateInput('');
    setWeightInput('');
    setFormError('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateMedicalRecord({
      weight_history: medicalRecord.weight_history.filter(w => w.id !== id),
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
          <DateInput
            value={dateInput}
            onChange={iso => {
              setDateInput(iso);
              setFormError('');
            }}
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
