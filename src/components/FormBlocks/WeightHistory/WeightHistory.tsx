import { useContext, useState } from 'react';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { WeighingEvent } from '../../../types/schema.ts';
import './WeightHistory.css';
import '../event-form.css';
import { DeleteIcon, PlusIcon } from '../../common/icons/icons.tsx';
import { isoToEuropean } from '../../../utils/formatting.ts';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { FormSection } from '../../FormSection/FormSection.tsx';
import { SmallIconButton } from '../../common/IconButton/IconButton.tsx';
import { Modal } from '../../common/Modal/Modal.tsx';

export function WeightHistory() {
  const { medicalRecord, updateMedicalRecord } = useContext(MedRecContext);
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [formError, setFormError] = useState('');

  if (!medicalRecord) return null;

  const entries = medicalRecord.events
    .filter((e): e is WeighingEvent => e.eventType === 'weighing')
    .sort((a, b) => b.date.localeCompare(a.date));

  const resetForm = () => {
    setDateInput('');
    setWeightInput('');
    setFormError('');
  };

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
      title="Weight History"
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
        title="Add Weight Entry"
      >
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
      </Modal>

      {entries.length === 0 ? (
        <p className="event-empty">
          No weight entries yet. Add one to start tracking.
        </p>
      ) : (
        <>
          {entries.length >= 2 && <WeightChart entries={entries} />}
          <table className="event-table">
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
        </>
      )}
    </FormSection>
  );
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function WeightChart({ entries }: { entries: WeighingEvent[] }) {
  // Sort chronologically for the chart (oldest first)
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const weights = sorted.map(e => e.weight_kg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const rangeW = maxW - minW || 1;

  // Convert dates to timestamps for proportional spacing
  const timestamps = sorted.map(e => new Date(e.date).getTime());
  const minT = timestamps[0];
  const maxT = timestamps[timestamps.length - 1];
  const rangeT = maxT - minT || 1;

  // Chart dimensions
  const width = 500;
  const height = 200;
  const padX = 50;
  const padY = 30;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  // Helper: convert a timestamp to an X coordinate
  const timeToX = (t: number) => padX + ((t - minT) / rangeT) * chartW;

  // Data points positioned by actual date
  const points = sorted.map((entry, i) => {
    const x = timeToX(timestamps[i]);
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

  // Generate monthly ticks between the data range
  // Start from the 1st of the month of the earliest date,
  // end at the 1st of the month after the latest date.
  const minDate = new Date(sorted[0].date);

  const monthTicks: {
    x: number;
    month: number;
    year: number;
    label: boolean;
  }[] = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  // Advance one month so the first tick is inside or at the start of the range
  if (cursor.getTime() < minT) {
    cursor.setMonth(cursor.getMonth() + 1);
  }
  while (cursor.getTime() <= maxT) {
    const t = cursor.getTime();
    const month = cursor.getMonth(); // 0-indexed
    const year = cursor.getFullYear();
    // Label on January (0) and July (6)
    const isLabelMonth = month === 0 || month === 6;
    monthTicks.push({ x: timeToX(t), month, year, label: isLabelMonth });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // Fallback: if no ticks got a label (data range < 6 months),
  // label the first and last month ticks.
  const hasAnyLabel = monthTicks.some(t => t.label);
  if (!hasAnyLabel && monthTicks.length > 0) {
    monthTicks[0].label = true;
    if (monthTicks.length > 1) {
      monthTicks[monthTicks.length - 1].label = true;
    }
  }

  const tickTop = padY + chartH;
  const tickLen = 5;

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

        {/* Monthly tick marks and labels */}
        {monthTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={tick.x}
              y1={tickTop}
              x2={tick.x}
              y2={tickTop + tickLen}
              className={
                tick.label ? 'weight-chart-tick-label' : 'weight-chart-tick'
              }
            />
            {tick.label && (
              <text
                x={tick.x}
                y={tickTop + tickLen + 12}
                textAnchor="middle"
                className="weight-chart-label"
              >
                {`${MONTH_LABELS[tick.month]} ${tick.year}`}
              </text>
            )}
          </g>
        ))}

        {/* Line */}
        <polyline points={polyline} fill="none" className="weight-chart-line" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2"
            className="weight-chart-dot"
          />
        ))}
      </svg>
    </div>
  );
}
