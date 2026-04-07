import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MedRecProvider } from './context/MedRecContext';
import { ToastProvider } from './components/common/Toast/Toast';
import { Navigation } from './components/Navigation/Navigation.tsx';
import { HomePage } from './pages/HomePage';
import { AnimalPage } from './pages/AnimalPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <MedRecProvider>
        <ToastProvider>
          <Navigation>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/animal" element={<AnimalPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Navigation>
        </ToastProvider>
      </MedRecProvider>
    </BrowserRouter>
  );
}

export default App;
