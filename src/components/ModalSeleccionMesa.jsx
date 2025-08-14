import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

const ModalSeleccionMesa = ({ isOpen, onClose, onReservaCompleta }) => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [mesasOcupadas, setMesasOcupadas] = useState([]); // ocupadas en Firestore para fecha/hora
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Carga datos del paso anterior y mesas ocupadas del slot
  useEffect(() => {
    if (!isOpen) return;

    const data = JSON.parse(localStorage.getItem('reservaTemporal')) || {};
    setFecha(data.fecha || '');
    setHora(data.hora || '');

    // Cargar ocupación de Firestore para la fecha/hora elegida
    const cargarOcupadas = async () => {
      try {
        if (!data.fecha || !data.hora) return;
        const q = query(
          collection(db, 'reservas'),
          where('fecha', '==', data.fecha),
          where('hora', '==', data.hora),
          where('estado', '!=', 'anulada') // si usas estado
        );
        const snap = await getDocs(q);
        const ocupadas = snap.docs.map(d => d.data().mesa);
        setMesasOcupadas(ocupadas);
      } catch (err) {
        console.error('Error cargando mesas ocupadas:', err);
      }
    };

    cargarOcupadas();
    setMesaSeleccionada(null);
  }, [isOpen]);

  const generarCodigo = () =>
    `R-${Math.floor(100000 + Math.random() * 900000)}`;

  // Chequea si existe el mismo cliente en el mismo slot
  const existeDuplicado = useCallback(async ({ nombre, fecha, hora }) => {
    const q = query(
      collection(db, 'reservas'),
      where('fecha', '==', fecha),
      where('hora', '==', hora),
      where('nombreLower', '==', (nombre || '').trim().toLowerCase())
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }, []);

  // Chequea si la mesa ya está ocupada para el slot
  const mesaYaOcupada = useCallback(async ({ mesa, fecha, hora }) => {
    const q = query(
      collection(db, 'reservas'),
      where('fecha', '==', fecha),
      where('hora', '==', hora),
      where('mesa', '==', mesa),
      where('estado', '!=', 'anulada')
    );
    const snap = await getDocs(q);
    return !snap.empty;
  }, []);

  const confirmarReserva = async () => {
    if (!mesaSeleccionada) {
      alert('Por favor, selecciona una mesa.');
      return;
    }

    const cliente = JSON.parse(localStorage.getItem('datosCliente')) || {};
    const nombre = (cliente.nombre || '').trim();
    const correo = (cliente.correo || '').trim();
    const telefono = (cliente.telefono || '').trim();

    if (!fecha || !hora || !nombre) {
      alert('Faltan datos de la reserva. Vuelve al paso anterior.');
      return;
    }

    try {
      setGuardando(true);

      // Duplicado por cliente en mismo slot
      const dup = await existeDuplicado({ nombre, fecha, hora });
      if (dup) {
        // dispara tu flujo existente para mostrar el modal de ya reservado
        const reservasLocal = JSON.parse(localStorage.getItem('reservas')) || [];
        const existente = reservasLocal.find(
          (r) =>
            (r.nombre || '').toLowerCase() === nombre.toLowerCase() &&
            r.fecha === fecha &&
            r.hora === hora
        );
        if (existente) {
          localStorage.setItem('reservaFinal', JSON.stringify(existente));
          const evento = new CustomEvent('reservaExistente', { detail: existente.codigo });
          window.dispatchEvent(evento);
        } else {
          // si no está en local, igual avisamos con un código genérico
          alert('Esta persona ya tiene una reserva en ese horario.');
        }
        onClose?.();
        return;
      }

      // Colisión de mesa
      const ocupada = await mesaYaOcupada({ mesa: mesaSeleccionada, fecha, hora });
      if (ocupada) {
        alert(`La ${mesaSeleccionada} ya está reservada en esa fecha y hora.`);
        return;
      }

      // Guardar
      const codigo = generarCodigo();
      const docData = {
        codigo,
        nombre,
        correo,
        telefono,
        fecha,
        hora,
        mesa: mesaSeleccionada,
        estado: 'activa',
        // campos normalizados para consultas
        nombreLower: nombre.toLowerCase(),
        correoLower: correo.toLowerCase(),
      };

      await addDoc(collection(db, 'reservas'), docData);

      // Mantener compatibilidad local (si tu flujo lo usa)
      const reservasLocal = JSON.parse(localStorage.getItem('reservas')) || [];
      localStorage.setItem('reservas', JSON.stringify([...reservasLocal, docData]));
      localStorage.setItem('reservaActiva', JSON.stringify(docData));
      localStorage.setItem('reservaFinal', JSON.stringify(docData));

      // Notificar al contenedor para mostrar ModalYaReservado
      onReservaCompleta?.(codigo);
    } catch (err) {
      console.error('Error al guardar la reserva:', err);
      alert('Hubo un error al registrar la reserva.');
    } finally {
      setGuardando(false);
    }
  };

  const mesas = Array.from({ length: 12 }, (_, i) => `Mesa ${i + 1}`);

  const estadoMesa = (mesa) => {
    if (mesasOcupadas.includes(mesa)) return 'mesa-ocupada';
    if (mesa === mesaSeleccionada) return 'mesa-seleccionada';
    return 'mesa-disponible';
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-contenido">
        <span className="cerrar-modal" onClick={onClose}>&times;</span>
        <h2>Selecciona tu mesa</h2>

        <div className="leyenda">
          <span className="mesa-disponible">Disponible</span>
          <span className="mesa-ocupada">Ocupada</span>
          <span className="mesa-seleccionada">Seleccionada</span>
        </div>

        <div className="plano">
          <div className="plano-mesas">
            {mesas.map((mesa) => {
              const estado = estadoMesa(mesa);
              const ocupada = estado === 'mesa-ocupada';
              return (
                <div
                  key={mesa}
                  className={`mesa ${estado}`}
                  onClick={() => !ocupada && setMesaSeleccionada(mesa)}
                >
                  {mesa}
                </div>
              );
            })}
          </div>
        </div>

        <button
          className="boton-reservar-final"
          onClick={confirmarReserva}
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Confirmar Reserva'}
        </button>
      </div>
    </div>
  );
};

export default ModalSeleccionMesa;








