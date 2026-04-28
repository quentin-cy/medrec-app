import type { WeighingEvent } from '../../types/schema.ts';
import './WeightChart.css';

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

export function WeightChart({ entries }: { entries: WeighingEvent[] }) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const weights = sorted.map(e => e.weight_kg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const rangeW = maxW - minW || 1;

  const timestamps = sorted.map(e => new Date(e.date).getTime());
  const minT = timestamps[0];
  const maxT = timestamps[timestamps.length - 1];
  const rangeT = maxT - minT || 1;

  const width = 500;
  const height = 200;
  const padX = 50;
  const padY = 30;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const timeToX = (t: number) => padX + ((t - minT) / rangeT) * chartW;

  const points = sorted.map((entry, i) => {
    const x = timeToX(timestamps[i]);
    const y = padY + chartH - ((entry.weight_kg - minW) / rangeW) * chartH;
    return { x, y, entry };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = minW + (rangeW * i) / 4;
    const y = padY + chartH - ((val - minW) / rangeW) * chartH;
    return { val: val.toFixed(1), y };
  });

  const minDate = new Date(sorted[0].date);
  const monthTicks: {
    x: number;
    month: number;
    year: number;
    label: boolean;
  }[] = [];
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  if (cursor.getTime() < minT) {
    cursor.setMonth(cursor.getMonth() + 1);
  }
  while (cursor.getTime() <= maxT) {
    const t = cursor.getTime();
    const month = cursor.getMonth();
    const year = cursor.getFullYear();
    const isLabelMonth = month === 0 || month === 6;
    monthTicks.push({ x: timeToX(t), month, year, label: isLabelMonth });
    cursor.setMonth(cursor.getMonth() + 1);
  }

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
        <polyline points={polyline} fill="none" className="weight-chart-line" />
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
