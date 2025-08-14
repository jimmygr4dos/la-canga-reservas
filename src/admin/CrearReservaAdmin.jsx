// src/admin/CrearReservaAdmin.jsx
import React, { useState } from 'react';
import '../styles/estilos.css';
import ModalYaReservado from '../components/ModalYaReservado';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // ✅ Correcto

const CrearReservaAdmin = () => {
  const [reserva, setReserva] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fecha: '',
    hora: '',
    mesa: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [codigoReserva, setCodigoReserva] = useState('');

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const snapshot = await getDocs(collection(db, 'reservas'));
      const reservasExistentes = snapshot.docs.map((doc) => doc.data());

      const yaExiste = reservasExistentes.find(
        (r) =>
          r.nombre?.toLowerCase() === reserva.nombre.toLowerCase() &&
          r.fecha === reserva.fecha &&
          r.hora === reserva.hora
      );
      if (yaExiste) {
        alert(`Ya existe una reserva para ${reserva.nombre} en esa fecha y hora.`);
        return;
      }

      const mesaOcupada = reservasExistentes.find(
        (r) => r.mesa === reserva.mesa && r.fecha === reserva.fecha && r.hora === reserva.hora
      );
      if (mesaOcupada) {
        alert(`La ${reserva.mesa} ya está reservada en esa fecha y hora.`);
        return;
      }

      const nuevoCodigo = `R-${Math.floor(100000 + Math.random() * 900000)}`;
      const nuevaReserva = {
        ...reserva,
        codigo: nuevoCodigo,
        estado: 'activa',
      };

      await addDoc(collection(db, 'reservas'), nuevaReserva);
      setCodigoReserva(nuevoCodigo);
      setModalVisible(true);
    } catch (error) {
      console.error('Error al crear reserva:', error);
      alert('Hubo un error al registrar la reserva.');
    }
  };

  const iniciarNuevaReserva = () => {
    setReserva({
      nombre: '',
      correo: '',
      telefono: '',
      fecha: '',
      hora: '',
      mesa: '',
    });
    setCodigoReserva('');
    setModalVisible(false);
  };

  return (
    <div className="crear-reserva-admin">
      <h2>Crear Reserva Manual</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="cr-nombre">Nombre:</label>
          <input
            id="cr-nombre"
            type="text"
            name="nombre"
            value={reserva.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="cr-correo">Correo:</label>
          <input
            id="cr-correo"
            type="email"
            name="correo"
            value={reserva.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="cr-telefono">Teléfono:</label>
          <input
            id="cr-telefono"
            type="tel"
            name="telefono"
            value={reserva.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="cr-fecha">Fecha:</label>
          <input
            id="cr-fecha"
            type="date"
            name="fecha"
            value={reserva.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="cr-hora">Hora:</label>
          <input
            id="cr-hora"
            type="time"
            name="hora"
            value={reserva.hora}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="cr-mesa">Mesa:</label>
          <select
            id="cr-mesa"
            name="mesa"
            value={reserva.mesa}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar Mesa</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={`Mesa ${i + 1}`}>{`Mesa ${i + 1}`}</option>
            ))}
          </select>
        </div>

        <button type="submit">Crear Reserva</button>
      </form>

      <ModalYaReservado
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        codigo={codigoReserva}
        onNuevaReserva={iniciarNuevaReserva}
      />
    </div>
  );
};

export default CrearReservaAdmin;





