import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast/Toast';
import { Navigation } from './components/Navigation/Navigation.tsx';
import { HomePage } from './pages/HomePage';
import { AnimalPage } from './pages/AnimalPage';
import { SettingsPage } from './pages/SettingsPage';
import { MedRecContextProvider } from './context/MedRecContextProvider.tsx';

function App() {
  return (
    <BrowserRouter basename="/medrec-app">
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
    </BrowserRouter>
  );
}

export default App;
