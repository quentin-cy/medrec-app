import { useContext, useMemo } from 'react';
import type { Event } from '../../types/schema.ts';
import { MedRecContext } from '../../context/MedRecContext.tsx';
import { isoToEuropean } from '../../utils/formatting.ts';
import { DeleteIcon } from '../common/icons/icons.tsx';
import type {
  VaccinationEvent,
  PestControlEvent,
  WeighingEvent,
  AppointmentEvent,
} from '../../types/schema.ts';

const BADGE_LABELS: Record<Event['eventType'], string> = {
  vaccination: 'Vaccination',
  pest_control: 'Pest Control',
  weighing: 'Weighing',
  appointment: 'Appointment',
};

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onDelete }: EventCardProps) {
  return (
    <div className="event-card">
      <div className="event-card-header">
        <span className="event-card-date">{isoToEuropean(event.date)}</span>
        <span
          className={`event-card-badge event-card-badge--${event.eventType}`}
        >
          {BADGE_LABELS[event.eventType]}
        </span>
      </div>
      <div className="event-card-body">
        <EventCardBody event={event} />
      </div>
      <button
        className="event-card-delete"
        onClick={() => onDelete(event.id)}
        title="Delete entry"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

function EventCardBody({ event }: { event: Event }) {
  switch (event.eventType) {
    case 'vaccination':
      return <VaccinationBody event={event} />;
    case 'pest_control':
      return <PestControlBody event={event} />;
    case 'weighing':
      return <WeighingBody event={event} />;
    case 'appointment':
      return <AppointmentBody event={event} />;
  }
}

function VaccinationBody({ event }: { event: VaccinationEvent }) {
  const { medicalContext } = useContext(MedRecContext);

  const typeLabels = useMemo(
    () =>
      Object.fromEntries(
        medicalContext.vaccination_types.map(t => [t.value, t.label]),
      ) as Record<number, string>,
    [medicalContext.vaccination_types],
  );

  const vetLabel = useMemo(() => {
    const v = medicalContext.vets.find(v => v.value === event.vet);
    return v
      ? v.practice
        ? `${v.name} (${v.practice})`
        : v.name
      : String(event.vet);
  }, [medicalContext.vets, event.vet]);

  return (
    <>
      <Field
        label="Types"
        value={event.types.map(t => typeLabels[t] ?? t).join(', ')}
      />
      <Field label="Reference" value={event.reference} />
      <Field label="Vet" value={vetLabel} />
    </>
  );
}

function PestControlBody({ event }: { event: PestControlEvent }) {
  const { medicalContext } = useContext(MedRecContext);

  const typeLabel = useMemo(() => {
    const t = medicalContext.pest_control_types.find(
      t => t.value === event.type,
    );
    return t ? t.label : String(event.type);
  }, [medicalContext.pest_control_types, event.type]);

  return (
    <>
      <Field label="Type" value={typeLabel} />
      <Field label="Reference" value={event.reference} />
      {event.comment && <Field label="Comment" value={event.comment} />}
    </>
  );
}

function WeighingBody({ event }: { event: WeighingEvent }) {
  return <Field label="Weight" value={`${event.weight_kg} kg`} />;
}

function AppointmentBody({ event }: { event: AppointmentEvent }) {
  const { medicalContext } = useContext(MedRecContext);

  const vetLabel = useMemo(() => {
    const v = medicalContext.vets.find(v => v.value === event.vet);
    return v
      ? v.practice
        ? `${v.name} (${v.practice})`
        : v.name
      : String(event.vet);
  }, [medicalContext.vets, event.vet]);

  return (
    <>
      <Field label="Vet" value={vetLabel} />
      {event.comment && <Field label="Comment" value={event.comment} />}
      {event.price > 0 && (
        <Field label="Price" value={event.price.toFixed(2)} />
      )}
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="event-card-field">
      <span className="event-card-field-label">{label}:</span>
      <span className="event-card-field-value">{value}</span>
    </div>
  );
}
