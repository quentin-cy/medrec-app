import { NavLink } from 'react-router-dom';
import { useMedRec } from '../../context/MedRecContext';
import './Navigation.css';
import { GearIcon } from '../common/icons/icons.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

export function Navigation({ children }: LayoutProps) {
  const { animal } = useMedRec();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <NavLink to="/" className="layout-logo">
            MedRec
          </NavLink>
          <nav className="layout-nav">
            {animal && (
              <>
                <NavLink
                  to="/animal"
                  className={({ isActive }) =>
                    `layout-nav-link ${isActive ? 'layout-nav-link-active' : ''}`
                  }
                >
                  {animal.name ? animal.name : 'New Animal'}
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

