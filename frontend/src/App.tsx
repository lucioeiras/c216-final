import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { EquipeDetails } from './pages/EquipeDetails';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/equipe/:id" element={<EquipeDetails />} />
      </Routes>
    </Router>
  );
}
