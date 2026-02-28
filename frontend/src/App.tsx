import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import PipelineDetailPage from './pages/PipelineDetailPage';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="application/:id" element={<ApplicationDetailPage />} />
            <Route path="pipeline/:id" element={<PipelineDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
