import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import '../styles/estilos.css';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // ✅ Corrección aquí

const Dashboard = () => {
  const { logueado } = useUser();

  const [reservas, setReservas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    anuladas: 0,
    ocupadas: 0,
    disponibles: 0
  });

  useEffect(() => {
    if (logueado) {
      cargarReservasDesdeFirestore();
    }
  }, [logueado]);

  const cargarReservasDesdeFirestore = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reservas'));
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const activas = datos.filter(r => r.estado !== 'anulada');
      const anuladas = datos.filter(r => r.estado === 'anulada');

      setReservas(activas);

      setEstadisticas({
        total: datos.length,
        anuladas: anuladas.length,
        ocupadas: activas.length,
        disponibles: 16 - activas.length
      });
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    }
  };

  const eliminarReserva = async (id) => {
    if (window.confirm('¿Deseas eliminar esta reserva?')) {
      try {
        await deleteDoc(doc(db, 'reservas', id));
        await cargarReservasDesdeFirestore();
      } catch (error) {
        console.error('Error eliminando reserva:', error);
      }
    }
  };

  const eliminarTodas = async () => {
    if (window.confirm('¿Eliminar TODAS las reservas (activas y anuladas)?')) {
      const snapshot = await getDocs(collection(db, 'reservas'));
      for (const docu of snapshot.docs) {
        await deleteDoc(doc(db, 'reservas', docu.id));
      }
      await cargarReservasDesdeFirestore();
    }
  };

  const limpiarAnuladas = async () => {
    if (window.confirm('¿Deseas eliminar solo las reservas anuladas?')) {
      const snapshot = await getDocs(collection(db, 'reservas'));
      for (const docu of snapshot.docs) {
        const data = docu.data();
        if (data.estado === 'anulada') {
          await deleteDoc(doc(db, 'reservas', docu.id));
        }
      }
      await cargarReservasDesdeFirestore();
    }
  };

  if (!logueado) {
    return <p style={{ textAlign: 'center' }}>Acceso denegado. Inicia sesión como administrador.</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <div className="estadisticas">
        <div className="card"><h3>Total de Reservas</h3><p>{estadisticas.total}</p></div>
        <div className="card"><h3>Reservas Anuladas</h3><p>{estadisticas.anuladas}</p></div>
        <div className="card"><h3>Mesas Ocupadas</h3><p>{estadisticas.ocupadas}</p></div>
        <div className="card"><h3>Mesas Disponibles</h3><p>{estadisticas.disponibles}</p></div>
      </div>

      <div className="acciones">
        <button onClick={eliminarTodas}>Eliminar todas las reservas</button>
        <button onClick={limpiarAnuladas}>Limpiar anuladas</button>
      </div>

      <h2>Listado de Reservas</h2>
      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Mesa</th>
              <th>Código</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? reservas.map(reserva => (
              <tr key={reserva.id}>
                <td>{reserva.nombre}</td>
                <td>{reserva.correo}</td>
                <td>{reserva.telefono}</td>
                <td>{reserva.fecha}</td>
                <td>{reserva.hora}</td>
                <td>{reserva.mesa}</td>
                <td>{reserva.codigo}</td>
                <td>
                  <button
                    style={{ background: '#b30000', color: 'white' }}
                    onClick={() => eliminarReserva(reserva.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>No hay reservas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
