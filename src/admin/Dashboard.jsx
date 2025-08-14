// src/admin/Dashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useUser } from '../UserContext';
import '../styles/estilos.css';

import {
  collection,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

import ModalYaReservado from '../components/ModalYaReservado';

// Fila de tabla memoizada para evitar renders innecesarios
const FilaReserva = React.memo(function FilaReserva({ r, onEditar, onEliminar }) {
  return (
    <tr>
      <td data-label="Nombre">{r.nombre}</td>
      <td data-label="Correo">{r.correo}</td>
      <td data-label="Teléfono">{r.telefono}</td>
      <td data-label="Fecha">{r.fecha}</td>
      <td data-label="Hora">{r.hora}</td>
      <td data-label="Mesa">{r.mesa}</td>
      <td data-label="Código">{r.codigo}</td>
      <td data-label="Estado">{r.estado || 'activa'}</td>
      <td style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onEditar(r)}>Editar</button>
        <button
          style={{ background: '#b30000', color: 'white' }}
          onClick={() => onEliminar(r.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
});

const Dashboard = () => {
  const { logueado } = useUser();

  const [reservas, setReservas] = useState([]);       // solo activas (para la tabla)
  const [anuladasCount, setAnuladasCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Modal de edición
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);

  // Modal de mensaje (reutiliza ModalYaReservado)
  const [modalMensajeOpen, setModalMensajeOpen] = useState(false);
  const [codigoConfirmacion, setCodigoConfirmacion] = useState('');

  // ========= Realtime: suscripción a Firestore =========
  useEffect(() => {
    if (!logueado) return;

    const col = collection(db, 'reservas');
    const unsub = onSnapshot(col, (snapshot) => {
      const datos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const activas = datos.filter((r) => r.estado !== 'anulada');
      const anuladas = datos.filter((r) => r.estado === 'anulada');

      setReservas(activas);                 // tabla muestra solo activas
      setAnuladasCount(anuladas.length);
      setTotalCount(datos.length);
    });

    return () => unsub();
  }, [logueado]);

  // ========= Estadísticas derivadas =========
  const estadisticas = useMemo(() => {
    const ocupadas = reservas.length;           // activas
    const disponibles = Math.max(16 - ocupadas, 0);
    return {
      total: totalCount,
      anuladas: anuladasCount,
      ocupadas,
      disponibles,
    };
  }, [reservas, anuladasCount, totalCount]);

  // ========= Acciones =========
  const eliminarReserva = useCallback(async (id) => {
    if (!window.confirm('¿Deseas eliminar esta reserva?')) return;
    try {
      await deleteDoc(doc(db, 'reservas', id));
      // onSnapshot actualizará la tabla automáticamente
    } catch (error) {
      console.error('Error eliminando reserva:', error);
    }
  }, []);

  const eliminarTodas = useCallback(async () => {
    if (!window.confirm('¿Eliminar TODAS las reservas (activas y anuladas)?')) return;
    try {
      const snapshot = await getDocs(collection(db, 'reservas'));
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'reservas', d.id));
      }
      // onSnapshot se encarga del refresco
    } catch (error) {
      console.error('Error al eliminar todas las reservas:', error);
    }
  }, []);

  const limpiarAnuladas = useCallback(async () => {
    if (!window.confirm('¿Deseas eliminar solo las reservas anuladas?')) return;
    try {
      const snapshot = await getDocs(collection(db, 'reservas'));
      for (const d of snapshot.docs) {
        const data = d.data();
        if (data.estado === 'anulada') {
          await deleteDoc(doc(db, 'reservas', d.id));
        }
      }
      // onSnapshot se encarga del refresco
    } catch (error) {
      console.error('Error limpiando anuladas:', error);
    }
  }, []);

  // ---- EDICIÓN ----
  const abrirEditor = useCallback((reserva) => {
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
  }, []);

  const cerrarEditor = useCallback(() => {
    setModalEditOpen(false);
    setReservaEditando(null);
  }, []);

  const onChangeEdit = useCallback((e) => {
    const { name, value } = e.target;
    setReservaEditando((prev) => ({ ...prev, [name]: value }));
  }, []);

  const guardarEdicion = useCallback(async () => {
    if (!reservaEditando) return;
    const { id, nombre, correo, telefono, fecha, hora, mesa, codigo, estado } = reservaEditando;

    if (!nombre || !correo || !telefono || !fecha || !hora || !mesa) {
      alert('Completa todos los campos.');
      return;
    }

    try {
      // Verificar conflicto: misma mesa+fecha+hora en OTRO documento
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

      // Actualizar documento
      const ref = doc(db, 'reservas', id);
      await updateDoc(ref, { nombre, correo, telefono, fecha, hora, mesa, estado });

      // Confirmación (reutilizamos tu modal)
      setCodigoConfirmacion(codigo || 'Actualizado');
      setModalMensajeOpen(true);

      cerrarEditor();
      // onSnapshot se encargará de refrescar lista
    } catch (error) {
      console.error('Error al editar reserva:', error);
      alert('Ocurrió un error al actualizar la reserva.');
    }
  }, [cerrarEditor, reservaEditando]);

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
            {reservas.length > 0 ? (
              reservas.map((r) => (
                <FilaReserva
                  key={r.id}
                  r={r}
                  onEditar={abrirEditor}
                  onEliminar={eliminarReserva}
                />
              ))
            ) : (
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

      {/* Modal de confirmación: reutiliza tu ModalYaReservado */}
      <ModalYaReservado
        isOpen={modalMensajeOpen}
        onClose={() => setModalMensajeOpen(false)}
        onNuevaReserva={() => setModalMensajeOpen(false)}
        codigo={codigoConfirmacion}
        titulo="CAMBIOS GUARDADOS"
        mensaje="La reserva fue actualizada correctamente."
      />
    </div>
  );
};

export default Dashboard;

