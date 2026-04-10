import { useState, useMemo, useContext } from 'react';
import { MedRecContext } from '../../../context/MedRecContext.tsx';
import { Select } from '../../common/Select/Select.tsx';
import { MultiSelect } from '../../common/MultiSelect/MultiSelect.tsx';
import { DateInput } from '../../common/DateInput/DateInput.tsx';
import { generateId } from '../../../utils/utils.ts';
import type { Vaccination as VaccinationEntry } from '../../../types/schema.ts';
import './Vaccination.css';
import { DeleteIcon, PlusIcon } from '../../common/icons/icons.tsx';
import { isoToEuropean } from '../../../utils/formatting.ts';
import { SmallIconButton } from '../../common/IconButton/IconButton.tsx';
import { FormSection } from '../../FormSection/FormSection.tsx';
import { TextField } from '../../common/TextField/TextField.tsx';

export function Vaccination() {
  const { medicalRecord, updateMedicalRecord, medicalContext } =
    useContext(MedRecContext);
  const [showForm, setShowForm] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [typesInput, setTypesInput] = useState<string[]>([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [vetInput, setVetInput] = useState('');
  const [formError, setFormError] = useState('');

  const typeOptions = useMemo(
    () =>
      medicalContext.vaccination_types.map(t => ({
        value: String(t.value),
        label: t.label,
      })),
    [medicalContext.vaccination_types],
  );

  const typeLabels = useMemo(
    () =>
      Object.fromEntries(
        medicalContext.vaccination_types.map(t => [t.value, t.label]),
      ) as Record<number, string>,
    [medicalContext.vaccination_types],
  );

  const formatVetDisplay = (v: { name: string; practice: string }) =>
    v.practice ? `${v.name} (${v.practice})` : v.name;

  const vetOptions = useMemo(
    () =>
      medicalContext.vets.map(v => ({
        value: String(v.value),
        label: formatVetDisplay(v),
      })),
    [medicalContext.vets],
  );

  const vetLabels = useMemo(
    () =>
      Object.fromEntries(
        medicalContext.vets.map(v => [v.value, formatVetDisplay(v)]),
      ) as Record<number, string>,
    [medicalContext.vets],
  );
  if (!medicalRecord) return null;
  const entries = [...medicalRecord.vaccination_history].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const handleAdd = () => {
    if (!dateInput) {
      setFormError('Enter a valid date (dd/mm/yyyy)');
      return;
    }

    if (typesInput.length === 0) {
      setFormError('Select at least one vaccination type');
      return;
    }

    if (!referenceInput.trim()) {
      setFormError('Enter a reference (vaccine name)');
      return;
    }

    if (vetInput === '') {
      setFormError('Select a vet');
      return;
    }

    const entry: VaccinationEntry = {
      id: generateId(),
      date: dateInput,
      types: typesInput.map(Number),
      reference: referenceInput.trim(),
      vet: Number(vetInput),
    };

    updateMedicalRecord({
      vaccination_history: [...medicalRecord.vaccination_history, entry],
    });

    setDateInput('');
    setTypesInput([]);
    setReferenceInput('');
    setVetInput('');
    setFormError('');
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    updateMedicalRecord({
      vaccination_history: medicalRecord.vaccination_history.filter(
        e => e.id !== id,
      ),
    });
  };

  return (
    <FormSection
      title="Vaccination"
      button={
        <SmallIconButton
          icon={<PlusIcon />}
          text="Add Entry"
          callback={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
        />
      }
    >
      {showForm && (
        <div className="vaccination-form">
          <DateInput
            value={dateInput}
            onChange={iso => {
              setDateInput(iso);
              setFormError('');
            }}
          />
          <div className="vaccination-form-select">
            <MultiSelect
              values={typesInput}
              onValuesChange={values => {
                setTypesInput(values);
                setFormError('');
              }}
              options={typeOptions}
              placeholder="Type(s)"
            />
          </div>
          <TextField
            id="reference"
            value={referenceInput}
            placeholder="Reference"
            onChange={e => {
              setReferenceInput(e.target.value);
              setFormError('');
            }}
          ></TextField>

          <div className="vaccination-form-select">
            <Select
              value={vetInput}
              onValueChange={value => {
                setVetInput(value);
                setFormError('');
              }}
              options={vetOptions}
              placeholder="Vet"
            />
          </div>
          <button className="vaccination-form-confirm" onClick={handleAdd}>
            Add
          </button>
          {formError && (
            <span className="vaccination-form-error">{formError}</span>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="vaccination-empty">
          No vaccination entries yet. Add one to start tracking.
        </p>
      ) : (
        <table className="vaccination-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Reference</th>
              <th>Vet</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{isoToEuropean(entry.date)}</td>
                <td>{entry.types.map(t => typeLabels[t] ?? t).join(', ')}</td>
                <td>{entry.reference}</td>
                <td>{vetLabels[entry.vet] ?? entry.vet}</td>
                <td>
                  <button
                    className="vaccination-delete-btn"
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
    </FormSection>
  );
}
