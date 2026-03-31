import { NavLink } from 'react-router-dom';
import { useMedRec } from '../../context/MedRecContext';
import { useFileExport } from '../../hooks/useFileExport';
import { useToast } from '../ui/Toast/Toast';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { animal } = useMedRec();
  const { exportFile, canExport } = useFileExport();
  const toast = useToast();

  const handleExport = () => {
    try {
      exportFile();
      toast.success('Exported', 'Medical record downloaded successfully');
    } catch {
      toast.error('Export failed', 'Could not export the medical record');
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <NavLink to="/" className={styles.logo}>
            MedRec
          </NavLink>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              Home
            </NavLink>
            {animal && (
              <NavLink
                to="/animal"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                Animal
              </NavLink>
            )}
          </nav>
          <div className={styles.actions}>
            {canExport && (
              <button className={styles.exportBtn} onClick={handleExport}>
                Export JSON
              </button>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
