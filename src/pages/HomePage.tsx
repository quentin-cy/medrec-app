import { useNavigate } from 'react-router-dom';
import { FileDropZone } from '../components/FileDropZone/FileDropZone';
import { useMedRec } from '../context/MedRecContext';
import { useFileImport } from '../hooks/useFileImport';
import { useToast } from '../components/common/Toast/Toast';
import { createBlankRecord } from '../utils/utils';
import './HomePage.css';

export function HomePage() {
  const { setAnimal, setVersion, setContext } = useMedRec();
  const { importFile } = useFileImport();
  const toast = useToast();
  const navigate = useNavigate();

  const handleFileSelected = async (file: File) => {
    try {
      const data = await importFile(file);
      setAnimal(data.animal);
      setVersion(data.metadata.version);
      setContext(data.context);
      toast.success('Imported', `Loaded record for "${data.animal.name}"`);
      navigate('/animal');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to import file';
      toast.error('Import failed', message);
    }
  };

  const handleNewAnimal = () => {
    setAnimal(createBlankRecord());
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
