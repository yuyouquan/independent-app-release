import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import APKDetailPage from './pages/APKDetailPage';
import GrayScaleMonitorPage from './pages/GrayScaleMonitorPage';
import { AppProvider } from './context/AppContext';
import { mockAPKProcess } from './data/mockData';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="application/:id" element={<ApplicationDetailPage />} />
            <Route path="pipeline/:id" element={<APKDetailPage apkProcess={mockAPKProcess} onBack={() => window.history.back()} />} />
            <Route path="gray-scale/:id" element={<GrayScaleMonitorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
