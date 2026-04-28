import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedRecContext } from '../context/MedRecContext';
import './SettingsPage.css';
import { DeleteIcon } from '../components/common/icons/icons.tsx';
import type { TypeOption, VetOption } from '../types/medicalContext.ts';
import type {
  VaccinationEvent,
  PestControlEvent,
  AppointmentEvent,
} from '../types/schema.ts';

export function SettingsPage() {
  const { medicalRecord, medicalContext, updateMedicalContext } =
    useContext(MedRecContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!medicalRecord) {
      navigate('/');
    }
  }, [medicalRecord, navigate]);

  /* --- Pest Control Types --- */

  const usedPestControlTypes = useMemo(() => {
    if (!medicalRecord) return new Set<number>();
    return new Set(
      medicalRecord.events
        .filter((e): e is PestControlEvent => e.eventType === 'pest_control')
        .map(e => e.type),
    );
  }, [medicalRecord]);

  const pestTypes = medicalContext.pest_control_types;

  const handlePestLabelChange = (index: number, label: string) => {
    const updated = pestTypes.map((t, i) =>
      i === index ? { ...t, label } : t,
    );
    updateMedicalContext({ pest_control_types: updated });
  };

  const handlePestDelete = (index: number) => {
    const updated = pestTypes.filter((_, i) => i !== index);
    updateMedicalContext({ pest_control_types: updated });
  };

  const handlePestAdd = () => {
    const nextValue =
      pestTypes.length > 0 ? Math.max(...pestTypes.map(t => t.value)) + 1 : 0;
    const entry: TypeOption = { value: nextValue, label: '' };
    updateMedicalContext({ pest_control_types: [...pestTypes, entry] });
  };

  /* --- Vaccination Types --- */

  const usedVaccinationTypes = useMemo(() => {
    if (!medicalRecord) return new Set<number>();
    return new Set(
      medicalRecord.events
        .filter((e): e is VaccinationEvent => e.eventType === 'vaccination')
        .flatMap(e => e.types),
    );
  }, [medicalRecord]);

  const vacTypes = medicalContext.vaccination_types;

  const handleVacLabelChange = (index: number, label: string) => {
    const updated = vacTypes.map((t, i) => (i === index ? { ...t, label } : t));
    updateMedicalContext({ vaccination_types: updated });
  };

  const handleVacDelete = (index: number) => {
    const updated = vacTypes.filter((_, i) => i !== index);
    updateMedicalContext({ vaccination_types: updated });
  };

  const handleVacAdd = () => {
    const nextValue =
      vacTypes.length > 0 ? Math.max(...vacTypes.map(t => t.value)) + 1 : 0;
    const entry: TypeOption = { value: nextValue, label: '' };
    updateMedicalContext({ vaccination_types: [...vacTypes, entry] });
  };

  /* --- Vets --- */

  const usedVets = useMemo(() => {
    if (!medicalRecord) return new Set<number>();
    return new Set(
      medicalRecord.events
        .filter(
          (e): e is VaccinationEvent | AppointmentEvent =>
            e.eventType === 'vaccination' || e.eventType === 'appointment',
        )
        .map(e => e.vet),
    );
  }, [medicalRecord]);

  const vets = medicalContext.vets;

  const handleVetNameChange = (index: number, name: string) => {
    const updated = vets.map((v, i) => (i === index ? { ...v, name } : v));
    updateMedicalContext({ vets: updated });
  };

  const handleVetPracticeChange = (index: number, practice: string) => {
    const updated = vets.map((v, i) => (i === index ? { ...v, practice } : v));
    updateMedicalContext({ vets: updated });
  };

  const handleVetDelete = (index: number) => {
    const updated = vets.filter((_, i) => i !== index);
    updateMedicalContext({ vets: updated });
  };

  const handleVetAdd = () => {
    const nextValue =
      vets.length > 0 ? Math.max(...vets.map(v => v.value)) + 1 : 0;
    const entry: VetOption = { value: nextValue, name: '', practice: '' };
    updateMedicalContext({ vets: [...vets, entry] });
  };

  if (!medicalRecord) return null;

  return (
    <div className="settings-page">
      <h1 className="settings-page-title">Settings</h1>

      {/* Pest Control Types */}
      <div className="settings-page-section">
        <h3 className="settings-page-section-title">Pest Control Types</h3>
        <p className="settings-page-section-description">
          Define the types of pest control treatments available in the record.
        </p>

        {pestTypes.length === 0 ? (
          <p className="settings-page-empty">
            No pest control types defined. Add one to get started.
          </p>
        ) : (
          <div className="settings-page-list">
            {pestTypes.map((type, index) => {
              const inUse = usedPestControlTypes.has(type.value);
              return (
                <div key={type.value} className="settings-page-row">
                  <span className="settings-page-value-badge">
                    {type.value}
                  </span>
                  <input
                    className="settings-page-label-input"
                    type="text"
                    value={type.label}
                    onChange={e => handlePestLabelChange(index, e.target.value)}
                    placeholder="Type label"
                  />
                  <button
                    className={
                      inUse
                        ? 'settings-page-delete-btn settings-page-delete-btn-disabled'
                        : 'settings-page-delete-btn'
                    }
                    onClick={() => handlePestDelete(index)}
                    disabled={inUse}
                    title={
                      inUse
                        ? 'Cannot delete: type is used by existing entries'
                        : 'Delete type'
                    }
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button className="settings-page-add-btn" onClick={handlePestAdd}>
          + Add Type
        </button>
      </div>

      {/* Vaccination Types */}
      <div className="settings-page-section">
        <h3 className="settings-page-section-title">Vaccination Types</h3>
        <p className="settings-page-section-description">
          Define the types of vaccinations available in the record.
        </p>

        {vacTypes.length === 0 ? (
          <p className="settings-page-empty">
            No vaccination types defined. Add one to get started.
          </p>
        ) : (
          <div className="settings-page-list">
            {vacTypes.map((type, index) => {
              const inUse = usedVaccinationTypes.has(type.value);
              return (
                <div key={type.value} className="settings-page-row">
                  <span className="settings-page-value-badge">
                    {type.value}
                  </span>
                  <input
                    className="settings-page-label-input"
                    type="text"
                    value={type.label}
                    onChange={e => handleVacLabelChange(index, e.target.value)}
                    placeholder="Type label"
                  />
                  <button
                    className={
                      inUse
                        ? 'settings-page-delete-btn settings-page-delete-btn-disabled'
                        : 'settings-page-delete-btn'
                    }
                    onClick={() => handleVacDelete(index)}
                    disabled={inUse}
                    title={
                      inUse
                        ? 'Cannot delete: type is used by existing entries'
                        : 'Delete type'
                    }
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button className="settings-page-add-btn" onClick={handleVacAdd}>
          + Add Type
        </button>
      </div>

      {/* Vets */}
      <div className="settings-page-section">
        <h3 className="settings-page-section-title">Vets</h3>
        <p className="settings-page-section-description">
          Define the veterinarians available when recording vaccinations.
        </p>

        {vets.length === 0 ? (
          <p className="settings-page-empty">
            No vets defined. Add one to get started.
          </p>
        ) : (
          <div className="settings-page-list">
            {vets.map((vet, index) => {
              const inUse = usedVets.has(vet.value);
              return (
                <div key={vet.value} className="settings-page-row">
                  <span className="settings-page-value-badge">{vet.value}</span>
                  <input
                    className="settings-page-label-input"
                    type="text"
                    value={vet.name}
                    onChange={e => handleVetNameChange(index, e.target.value)}
                    placeholder="Vet name"
                  />
                  <input
                    className="settings-page-label-input settings-page-practice-input"
                    type="text"
                    value={vet.practice}
                    onChange={e =>
                      handleVetPracticeChange(index, e.target.value)
                    }
                    placeholder="Practice (optional)"
                  />
                  <button
                    className={
                      inUse
                        ? 'settings-page-delete-btn settings-page-delete-btn-disabled'
                        : 'settings-page-delete-btn'
                    }
                    onClick={() => handleVetDelete(index)}
                    disabled={inUse}
                    title={
                      inUse
                        ? 'Cannot delete: vet is used by existing entries'
                        : 'Delete vet'
                    }
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button className="settings-page-add-btn" onClick={handleVetAdd}>
          + Add Vet
        </button>
      </div>
    </div>
  );
}
