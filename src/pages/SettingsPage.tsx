import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedRec } from '../context/MedRecContext';
import type { TypeOption, VetOption } from '../types/schema';
import './SettingsPage.css';

export function SettingsPage() {
  const { animal, context, updateContext } = useMedRec();
  const navigate = useNavigate();

  useEffect(() => {
    if (!animal) {
      navigate('/');
    }
  }, [animal, navigate]);

  /* --- Pest Control Types --- */

  const usedPestControlTypes = useMemo(() => {
    if (!animal) return new Set<number>();
    return new Set(animal.pest_control_history.map(e => e.type));
  }, [animal]);

  const pestTypes = context.pest_control_types;

  const handlePestLabelChange = (index: number, label: string) => {
    const updated = pestTypes.map((t, i) =>
      i === index ? { ...t, label } : t,
    );
    updateContext({ pest_control_types: updated });
  };

  const handlePestDelete = (index: number) => {
    const updated = pestTypes.filter((_, i) => i !== index);
    updateContext({ pest_control_types: updated });
  };

  const handlePestAdd = () => {
    const nextValue =
      pestTypes.length > 0 ? Math.max(...pestTypes.map(t => t.value)) + 1 : 0;
    const entry: TypeOption = { value: nextValue, label: '' };
    updateContext({ pest_control_types: [...pestTypes, entry] });
  };

  /* --- Vaccination Types --- */

  const usedVaccinationTypes = useMemo(() => {
    if (!animal) return new Set<number>();
    return new Set(animal.vaccination_history.map(e => e.type));
  }, [animal]);

  const vacTypes = context.vaccination_types;

  const handleVacLabelChange = (index: number, label: string) => {
    const updated = vacTypes.map((t, i) => (i === index ? { ...t, label } : t));
    updateContext({ vaccination_types: updated });
  };

  const handleVacDelete = (index: number) => {
    const updated = vacTypes.filter((_, i) => i !== index);
    updateContext({ vaccination_types: updated });
  };

  const handleVacAdd = () => {
    const nextValue =
      vacTypes.length > 0 ? Math.max(...vacTypes.map(t => t.value)) + 1 : 0;
    const entry: TypeOption = { value: nextValue, label: '' };
    updateContext({ vaccination_types: [...vacTypes, entry] });
  };

  /* --- Vets --- */

  const usedVets = useMemo(() => {
    if (!animal) return new Set<number>();
    return new Set(animal.vaccination_history.map(e => e.vet));
  }, [animal]);

  const vets = context.vets;

  const handleVetNameChange = (index: number, name: string) => {
    const updated = vets.map((v, i) => (i === index ? { ...v, name } : v));
    updateContext({ vets: updated });
  };

  const handleVetPracticeChange = (index: number, practice: string) => {
    const updated = vets.map((v, i) => (i === index ? { ...v, practice } : v));
    updateContext({ vets: updated });
  };

  const handleVetDelete = (index: number) => {
    const updated = vets.filter((_, i) => i !== index);
    updateContext({ vets: updated });
  };

  const handleVetAdd = () => {
    const nextValue =
      vets.length > 0 ? Math.max(...vets.map(v => v.value)) + 1 : 0;
    const entry: VetOption = { value: nextValue, name: '', practice: '' };
    updateContext({ vets: [...vets, entry] });
  };

  if (!animal) return null;

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
