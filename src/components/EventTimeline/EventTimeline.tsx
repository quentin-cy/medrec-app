import { useContext, useMemo, useState } from 'react';
import { MedRecContext } from '../../context/MedRecContext.tsx';
import { FormSection } from '../FormSection/FormSection.tsx';
import { SmallIconButton } from '../common/IconButton/IconButton.tsx';
import { PlusIcon } from '../common/icons/icons.tsx';
import { Modal } from '../common/Modal/Modal.tsx';
import { EventCard } from './EventCard.tsx';
import { WeightChart } from './WeightChart.tsx';
import { VaccinationForm } from './forms/VaccinationForm.tsx';
import { PestControlForm } from './forms/PestControlForm.tsx';
import { WeighingForm } from './forms/WeighingForm.tsx';
import { AppointmentForm } from './forms/AppointmentForm.tsx';
import type { EventType, WeighingEvent } from '../../types/schema.ts';
import './EventTimeline.css';

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  vaccination: 'Vaccination',
  pest_control: 'Pest Control',
  weighing: 'Weighing',
  appointment: 'Appointment',
};

const EVENT_TYPES: EventType[] = [
  'vaccination',
  'pest_control',
  'weighing',
  'appointment',
];

const FORM_TITLES: Record<EventType, string> = {
  vaccination: 'Add Vaccination',
  pest_control: 'Add Pest Control',
  weighing: 'Add Weight Entry',
  appointment: 'Add Appointment',
};

export function EventTimeline() {
  const { medicalRecord, updateMedicalRecord } = useContext(MedRecContext);
  const [showPicker, setShowPicker] = useState(false);
  const [formType, setFormType] = useState<EventType | null>(null);

  const sortedEvents = useMemo(() => {
    if (!medicalRecord) return [];
    return [...medicalRecord.events].sort(
      (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
    );
  }, [medicalRecord]);

  const weighingEntries = useMemo(
    () =>
      sortedEvents.filter(
        (e): e is WeighingEvent => e.eventType === 'weighing',
      ),
    [sortedEvents],
  );

  if (!medicalRecord) return null;

  const handleDelete = (id: string) => {
    updateMedicalRecord({
      events: medicalRecord.events.filter(e => e.id !== id),
    });
  };

  const handlePickType = (type: EventType) => {
    setShowPicker(false);
    setFormType(type);
  };

  const handleFormDone = () => {
    setFormType(null);
  };

  return (
    <FormSection
      title="Events"
      button={
        <SmallIconButton
          icon={<PlusIcon />}
          text="Add Event"
          callback={() => setShowPicker(true)}
        />
      }
    >
      {/* Step 1: Type picker modal */}
      <Modal open={showPicker} onOpenChange={setShowPicker} title="New Event">
        <div className="event-type-picker">
          {EVENT_TYPES.map(type => (
            <button
              key={type}
              className="event-type-picker-btn"
              onClick={() => handlePickType(type)}
            >
              <span className={`event-card-badge event-card-badge--${type}`}>
                {EVENT_TYPE_LABELS[type]}
              </span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Step 2: Event form modal */}
      <Modal
        open={formType !== null}
        onOpenChange={open => {
          if (!open) setFormType(null);
        }}
        title={formType ? FORM_TITLES[formType] : ''}
      >
        {formType === 'vaccination' && (
          <VaccinationForm onDone={handleFormDone} />
        )}
        {formType === 'pest_control' && (
          <PestControlForm onDone={handleFormDone} />
        )}
        {formType === 'weighing' && <WeighingForm onDone={handleFormDone} />}
        {formType === 'appointment' && (
          <AppointmentForm onDone={handleFormDone} />
        )}
      </Modal>

      {/* Weight chart */}
      {weighingEntries.length >= 2 && <WeightChart entries={weighingEntries} />}

      {/* Event list */}
      {sortedEvents.length === 0 ? (
        <p className="event-empty">No events yet. Add one to start tracking.</p>
      ) : (
        <div className="event-timeline-list">
          {sortedEvents.map(event => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </FormSection>
  );
}
