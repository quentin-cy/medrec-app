import { useNavigate } from 'react-router-dom';
import { FileDropZone } from '../components/FileDropZone/FileDropZone';
import { useMedRec } from '../context/MedRecContext';
import { useFileImport } from '../hooks/useFileImport';
import { useToast } from '../components/ui/Toast/Toast';
import { createBlankAnimal } from '../lib/utils';
import styles from './HomePage.module.css';

export function HomePage() {
  const { setAnimal } = useMedRec();
  const { importFile } = useFileImport();
  const toast = useToast();
  const navigate = useNavigate();

  const handleFileSelected = async (file: File) => {
    try {
      const data = await importFile(file);
      setAnimal(data.animal);
      toast.success('Imported', `Loaded record for "${data.animal.name}"`);
      navigate('/animal');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to import file';
      toast.error('Import failed', message);
    }
  };

  const handleNewAnimal = () => {
    setAnimal(createBlankAnimal());
    navigate('/animal');
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Animal Medical Records</h1>
        <p className={styles.subtitle}>
          Import, edit, and export JSON-based medical records for animals.
        </p>
      </div>

      <div className={styles.actions}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Import Existing Record</h2>
          <p className={styles.cardDescription}>
            Upload a .json file to view and edit an existing animal record.
          </p>
          <FileDropZone onFileSelected={handleFileSelected} />
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create New Record</h2>
          <p className={styles.cardDescription}>
            Start a fresh medical record for a new animal.
          </p>
          <button className={styles.newButton} onClick={handleNewAnimal}>
            New Animal Record
          </button>
        </div>
      </div>
    </div>
  );
}
