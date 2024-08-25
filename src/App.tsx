import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitiesTable from './components/CitiesTable';
import WeatherPage from './components/WeatherPage';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './pages/Layout';
import "./index.css";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<CitiesTable />} />
            <Route path="/weather/:city" element={<WeatherPage />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
