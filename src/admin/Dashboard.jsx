// src/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import '../styles/estilos.css';

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

import ModalYaReservado from '../components/ModalYaReservado'; // ✅ Importamos tu modal

const Dashboard = () => {
  const { logueado } = useUser();

  const [reservas, setReservas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    anuladas: 0,
    ocupadas: 0,
    disponibles: 0,
  });

  // Modal de edición
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);

  // Modal de mensaje (usando ModalYaReservado)
  const [modalMensajeOpen, setModalMensajeOpen] = useState(false);
  const [mensajeReserva, setMensajeReserva] = useState({ codigo: '', mensaje: '' });

  useEffect(() => {
    if (logueado) {
      cargarReservasDesdeFirestore();
    }
  }, [logueado]);

  const cargarReservasDesdeFirestore = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'reservas'));
      const datos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      const activas = datos.filter((r) => r.estado !== 'anulada');
      const anuladas = datos.filter((r) => r.estado === 'anulada');

      setReservas(activas);

      setEstadisticas({
        total: datos.length,
        anuladas: anuladas.length,
        ocupadas: activas.length,
        disponibles: 16 - activas.length,
      });
    } catch (error) {
      console.error('Error al cargar reservas:', error);
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
      try {
        const snapshot = await getDocs(collection(db, 'reservas'));
        for (const docu of snapshot.docs) {
          await deleteDoc(doc(db, 'reservas', docu.id));
        }
        await cargarReservasDesdeFirestore();
      } catch (error) {
        console.error('Error al eliminar todas las reservas:', error);
      }
    }
  };

  const limpiarAnuladas = async () => {
    if (window.confirm('¿Deseas eliminar solo las reservas anuladas?')) {
      try {
        const snapshot = await getDocs(collection(db, 'reservas'));
        for (const docu of snapshot.docs) {
          const data = docu.data();
          if (data.estado === 'anulada') {
            await deleteDoc(doc(db, 'reservas', docu.id));
          }
        }
        await cargarReservasDesdeFirestore();
      } catch (error) {
        console.error('Error limpiando anuladas:', error);
      }
    }
  };

  // ---- EDICIÓN ----
  const abrirEditor = (reserva) => {
    setReservaEditando({
      id: reserva.id,
      nombre: reserva.nombre || '',
      correo: reserva.correo || '',
      telefono: reserva.telefono || '',
      fecha: reserva.fecha || '',
      hora: reserva.hora || '',
      mesa: reserva.mesa || '',
      codigo: reserva.codigo || '',
      estado: reserva.estado || 'activa',
    });
    setModalEditOpen(true);
  };

  const cerrarEditor = () => {
    setModalEditOpen(false);
    setReservaEditando(null);
  };

  const onChangeEdit = (e) => {
    const { name, value } = e.target;
    setReservaEditando((prev) => ({ ...prev, [name]: value }));
  };

  const guardarEdicion = async () => {
    if (!reservaEditando) return;
    const { id, nombre, correo, telefono, fecha, hora, mesa, codigo, estado } = reservaEditando;

    if (!nombre || !correo || !telefono || !fecha || !hora || !mesa) {
      alert('Completa todos los campos.');
      return;
    }

    try {
      // 1) Verificar conflicto
      const q = query(
        collection(db, 'reservas'),
        where('mesa', '==', mesa),
        where('fecha', '==', fecha),
        where('hora', '==', hora)
      );

      const snapshot = await getDocs(q);
      const conflicto = snapshot.docs.some((d) => d.id !== id);

      if (conflicto) {
        alert('❌ No se puede actualizar: esa mesa ya está reservada para esa fecha y hora.');
        return;
      }

      // 2) Actualizar
      const ref = doc(db, 'reservas', id);
      await updateDoc(ref, { nombre, correo, telefono, fecha, hora, mesa, estado });

      // ✅ Mostrar modal visual de confirmación
      setMensajeReserva({
        codigo: codigo || '',
        mensaje: '✅ Reserva actualizada correctamente.',
      });
      setModalMensajeOpen(true);

      cerrarEditor();
      await cargarReservasDesdeFirestore();
    } catch (error) {
      console.error('Error al editar reserva:', error);
      alert('Ocurrió un error al actualizar la reserva.');
    }
  };

  if (!logueado) {
    return <p style={{ textAlign: 'center' }}>Acceso denegado. Inicia sesión como administrador.</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>

      <div className="estadisticas">
        <div className="card"><h3>Total</h3><p>{estadisticas.total}</p></div>
        <div className="card"><h3>Anuladas</h3><p>{estadisticas.anuladas}</p></div>
        <div className="card"><h3>Ocupadas</h3><p>{estadisticas.ocupadas}</p></div>
        <div className="card"><h3>Disponibles</h3><p>{estadisticas.disponibles}</p></div>
      </div>

      <div className="acciones">
        <button onClick={eliminarTodas}>Eliminar todas</button>
        <button onClick={limpiarAnuladas}>Limpiar anuladas</button>
      </div>

      <h2>Listado de Reservas</h2>
      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th><th>Correo</th><th>Teléfono</th>
              <th>Fecha</th><th>Hora</th><th>Mesa</th>
              <th>Código</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? reservas.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.correo}</td>
                <td>{r.telefono}</td>
                <td>{r.fecha}</td>
                <td>{r.hora}</td>
                <td>{r.mesa}</td>
                <td>{r.codigo}</td>
                <td>{r.estado || 'activa'}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => abrirEditor(r)}>Editar</button>
                  <button style={{ background: '#b30000', color: 'white' }} onClick={() => eliminarReserva(r.id)}>Eliminar</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="9" style={{ textAlign: 'center' }}>No hay reservas.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Edición */}
      {modalEditOpen && reservaEditando && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-contenido" style={{ maxWidth: 520, width: '100%' }}>
            <h2>Editar Reserva</h2>
            <div className="campo"><label>Nombre</label><input name="nombre" value={reservaEditando.nombre} onChange={onChangeEdit} /></div>
            <div className="campo"><label>Correo</label><input name="correo" value={reservaEditando.correo} onChange={onChangeEdit} /></div>
            <div className="campo"><label>Teléfono</label><input name="telefono" value={reservaEditando.telefono} onChange={onChangeEdit} /></div>
            <div className="campo"><label>Fecha</label><input type="date" name="fecha" value={reservaEditando.fecha} onChange={onChangeEdit} /></div>
            <div className="campo"><label>Hora</label><input type="time" name="hora" value={reservaEditando.hora} onChange={onChangeEdit} /></div>
            <div className="campo">
              <label>Mesa</label>
              <select name="mesa" value={reservaEditando.mesa} onChange={onChangeEdit}>
                <option value="">Seleccionar Mesa</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={`Mesa ${i + 1}`}>{`Mesa ${i + 1}`}</option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Estado</label>
              <select name="estado" value={reservaEditando.estado} onChange={onChangeEdit}>
                <option value="activa">Activa</option>
                <option value="anulada">Anulada</option>
              </select>
            </div>
            <div className="acciones" style={{ marginTop: 16 }}>
              <button onClick={guardarEdicion}>Guardar</button>
              <button onClick={cerrarEditor} style={{ background: '#777', color: '#fff' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ModalYaReservado reutilizado */}
      <ModalYaReservado
        isOpen={modalMensajeOpen}
        onClose={() => setModalMensajeOpen(false)}
        codigoReserva={mensajeReserva.codigo}
        mensajePersonalizado={mensajeReserva.mensaje} // lo agregamos como prop extra
      />
    </div>
  );
};

export default Dashboard;
