import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast/Toast';
import { Navigation } from './components/Navigation/Navigation.tsx';
import { HomePage } from './pages/HomePage';
import { AnimalPage } from './pages/AnimalPage';
import { SettingsPage } from './pages/SettingsPage';
import { MedRecContextProvider } from './context/MedRecContextProvider.tsx';

function App() {
  return (
    <HashRouter>
      <MedRecContextProvider>
        <ToastProvider>
          <Navigation>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/animal" element={<AnimalPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Navigation>
        </ToastProvider>
      </MedRecContextProvider>
    </HashRouter>
  );
}

export default App;
