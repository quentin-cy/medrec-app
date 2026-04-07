import { NavLink } from 'react-router-dom';
import './Navigation.css';
import { GearIcon } from '../common/icons/icons.tsx';
import { useContext } from 'react';
import { MedRecContext } from '../../context/MedRecContext.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export function Navigation({ children }: LayoutProps) {
  const { medicalRecord } = useContext(MedRecContext);

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <NavLink to="/" className="layout-logo">
            MedRec
          </NavLink>
          <nav className="layout-nav">
            {medicalRecord && (
              <>
                <NavLink
                  to="/animal"
                  className={({ isActive }) =>
                    `layout-nav-link ${isActive ? 'layout-nav-link-active' : ''}`
                  }
                >
                  {medicalRecord.name ? medicalRecord.name : 'New Animal'}
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `layout-settings-link ${isActive ? 'layout-nav-link-active' : ''}`
                  }
                  aria-label="Settings"
                >
                  <GearIcon />
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
}

