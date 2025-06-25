import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // vista pública (cliente)
import Dashboard from './components/Dashboard'; // vista admin

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
