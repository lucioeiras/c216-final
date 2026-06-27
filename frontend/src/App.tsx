import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { EquipeDetails } from './pages/EquipeDetails';
import { CreatePartida } from './pages/CreatePartida';
import { EditPartida } from './pages/EditPartida';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/equipe/:id" element={<EquipeDetails />} />
        <Route path="/partida/nova" element={<CreatePartida />} />
        <Route path="/partida/editar/:id" element={<EditPartida />} />
      </Routes>
    </Router>
  );
}
