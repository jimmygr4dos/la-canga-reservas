import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ListadoReservas from './ListadoReservas';
import ReservasAnuladas from './ReservasAnuladas';
import CrearReservaAdmin from './CrearReservaAdmin';
import { useUser } from '../UserContext'; 

const AdminApp = () => {
  const { logueado, login, logout } = useUser();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const resultado = login(usuario, clave);
    if (!resultado.ok) {
      setError(resultado.mensaje);
    }
  };

  if (!logueado) {
    return (
      <div className="modal">
        <div className="modal-contenido" style={{ maxWidth: '400px', margin: 'auto' }}>
          <h2>Login Administrador</h2>
          <form onSubmit={handleLogin}>
            <div className="campo">
              <label>Usuario:</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="campo">
              <label>Contraseña:</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav style={{ backgroundColor: '#8B0000', padding: '10px' }}>
        <Link to="/admin" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
        <Link to="/admin/reservas" style={{ color: 'white', marginRight: '15px' }}>Reservas</Link>
        <Link to="/admin/anuladas" style={{ color: 'white', marginRight: '15px' }}>Anuladas</Link>
        <Link to="/admin/crear" style={{ color: 'white', marginRight: '15px' }}>Crear Reserva</Link>
        <button onClick={logout} style={{ marginLeft: '20px', background: 'white', color: '#8B0000', border: 'none', padding: '5px 10px' }}>Cerrar Sesión</button>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservas" element={<ListadoReservas />} />
        <Route path="/anuladas" element={<ReservasAnuladas />} />
        <Route path="/crear" element={<CrearReservaAdmin />} />
      </Routes>
    </div>
  );
};

export default AdminApp;




