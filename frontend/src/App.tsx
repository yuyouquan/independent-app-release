import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="application/:id" element={<ApplicationDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
