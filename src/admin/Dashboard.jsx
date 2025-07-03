import React, { useEffect, useState } from 'react';
import '../styles/estilos.css';

const Dashboard = () => {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const [reservasTotales, setReservasTotales] = useState(0);
  const [reservasAnuladas, setReservasAnuladas] = useState(0);
  const [mesasOcupadas, setMesasOcupadas] = useState(0);
  const [mesasDisponibles, setMesasDisponibles] = useState(0);

  const handleLogin = (e) => {
    e.preventDefault();
    // Usuario y contraseña fijos
    if (usuario === 'admin' && clave === '1234') {
      setLogueado(true);
      setError('');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  useEffect(() => {
    if (logueado) {
      const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
      const anuladas = JSON.parse(localStorage.getItem('reservasAnuladas')) || [];

      setReservasTotales(reservas.length);
      setReservasAnuladas(anuladas.length);

      const ocupadas = reservas.map(r => r.mesa);
      const totalMesas = 16;
      setMesasOcupadas(ocupadas.length);
      setMesasDisponibles(totalMesas - ocupadas.length);
    }
  }, [logueado]);

  const limpiarReservas = () => {
    if (window.confirm('¿Estás seguro de eliminar todas las reservas?')) {
      localStorage.removeItem('reservas');
      window.location.reload();
    }
  };

  const limpiarAnuladas = () => {
    if (window.confirm('¿Estás seguro de limpiar las reservas anuladas?')) {
      localStorage.removeItem('reservasAnuladas');
      window.location.reload();
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
              <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
            </div>
            <div className="campo">
              <label>Contraseña:</label>
              <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="estadisticas">
        <div className="card">
          <h3>Total de Reservas</h3>
          <p>{reservasTotales}</p>
        </div>
        <div className="card">
          <h3>Reservas Anuladas</h3>
          <p>{reservasAnuladas}</p>
        </div>
        <div className="card">
          <h3>Mesas Ocupadas</h3>
          <p>{mesasOcupadas}</p>
        </div>
        <div className="card">
          <h3>Mesas Disponibles</h3>
          <p>{mesasDisponibles}</p>
        </div>
      </div>

      <div className="acciones">
        <button onClick={limpiarReservas}>Eliminar todas las reservas</button>
        <button onClick={limpiarAnuladas}>Limpiar anuladas</button>
      </div>
    </div>
  );
};

export default Dashboard;

