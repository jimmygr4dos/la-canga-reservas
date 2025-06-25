import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ListadoReservas from './ListadoReservas';
import ReservasAnuladas from './ReservasAnuladas';
import CrearReservaAdmin from './CrearReservaAdmin'; // NUEVO

const AdminApp = () => {
  return (
    <div>
      <nav style={{ backgroundColor: '#8B0000', padding: '10px' }}>
        <Link to="/admin" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
        <Link to="/admin/reservas" style={{ color: 'white', marginRight: '15px' }}>Reservas</Link>
        <Link to="/admin/anuladas" style={{ color: 'white', marginRight: '15px' }}>Anuladas</Link>
        <Link to="/admin/crear" style={{ color: 'white' }}>Crear Reserva</Link> {/* NUEVO */}
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservas" element={<ListadoReservas />} />
        <Route path="/anuladas" element={<ReservasAnuladas />} />
        <Route path="/crear" element={<CrearReservaAdmin />} /> {/* NUEVO */}
      </Routes>
    </div>
  );
};

export default AdminApp;




