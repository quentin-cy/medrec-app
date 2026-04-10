import { useNavigate } from 'react-router-dom';
import { FileDropZone } from '../components/FileDropZone/FileDropZone';
import { useFileImport } from '../hooks/useFileImport';
import { createBlankRecord } from '../utils/utils';
import './HomePage.css';
import { useContext } from 'react';
import { MedRecContext } from '../context/MedRecContext.tsx';
import { ToastContext } from '../components/common/Toast/ToastContext.tsx';

export function HomePage() {
  const { initAnimal, setRecordVersion, setMedicalContext } = useContext(MedRecContext);
  const { importFile } = useFileImport();
  const toast = useContext(ToastContext);
  const navigate = useNavigate();

  const handleFileSelected = async (file: File) => {
    try {
      const data = await importFile(file);
      initAnimal(data.animal);
      setRecordVersion(data.metadata.version);
      setMedicalContext(data.context);
      toast.success('Imported', `Loaded record for "${data.animal.name}"`);
      navigate('/animal');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to import file';
      toast.error('Import failed', message);
    }
  };

  const handleNewAnimal = () => {
    initAnimal(createBlankRecord());
    navigate('/animal');
  };

  return (
    <div className="home-page">
      <div className="home-page-hero">
        <h1 className="home-page-title">Animal Medical Records</h1>
        <p className="home-page-subtitle">
          Import, edit, and export JSON-based medical records for animals.
        </p>
      </div>

      <div className="home-page-actions">
        <div className="home-page-card">
          <h2 className="home-page-card-title">Import Existing Record</h2>
          <p className="home-page-card-description">
            Upload a .json file to view and edit an existing animal record.
          </p>
          <FileDropZone onFileSelected={handleFileSelected} />
        </div>

        <div className="home-page-divider">
          <span className="home-page-divider-text">or</span>
        </div>

        <div className="home-page-card">
          <h2 className="home-page-card-title">Create New Record</h2>
          <p className="home-page-card-description">
            Start a fresh medical record for a new animal.
          </p>
          <button className="home-page-new-button" onClick={handleNewAnimal}>
            New Animal Record
          </button>
        </div>
      </div>
    </div>
  );
}
