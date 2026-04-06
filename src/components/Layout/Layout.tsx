import { NavLink } from 'react-router-dom';
import { useMedRec } from '../../context/MedRecContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
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
              <NavLink
                to="/animal"
                className={({ isActive }) =>
                  `layout-nav-link ${isActive ? 'layout-nav-link-active' : ''}`
                }
              >
                {animal.name ? animal.name : 'New Animal'}
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="layout-main">{children}</main>
    </div>
  );
}
