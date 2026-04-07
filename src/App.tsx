import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MedRecProvider } from './context/MedRecContext';
import { ToastProvider } from './components/ui/Toast/Toast';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { AnimalPage } from './pages/AnimalPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <MedRecProvider>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/animal" element={<AnimalPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </MedRecProvider>
    </BrowserRouter>
  );
}

export default App;
