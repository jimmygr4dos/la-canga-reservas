import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import '../styles/estilos.css';

const Dashboard = () => {
  const { logueado } = useUser();

  const [reservasTotales, setReservasTotales] = useState(0);
  const [reservasAnuladas, setReservasAnuladas] = useState(0);
  const [mesasOcupadas, setMesasOcupadas] = useState(0);
  const [mesasDisponibles, setMesasDisponibles] = useState(0);

  useEffect(() => {
    if (logueado) {
      const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
      const anuladas = JSON.parse(localStorage.getItem('reservasAnuladas')) || [];

      setReservasTotales(reservas.length);
      setReservasAnuladas(anuladas.length);

      const totalMesas = 16;
      setMesasOcupadas(reservas.length);
      setMesasDisponibles(totalMesas - reservas.length);
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
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Acceso denegado. Inicia sesión como administrador.</p>;
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


