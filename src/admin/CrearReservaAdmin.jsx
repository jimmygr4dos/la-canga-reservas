import React, { useState } from 'react';
import '../styles/estilos.css';

const CrearReservaAdmin = () => {
  const [reserva, setReserva] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fecha: '',
    hora: '',
    mesa: '',
  });

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    const yaExiste = reservas.find(
      (r) =>
        r.nombre.toLowerCase() === reserva.nombre.toLowerCase() &&
        r.fecha === reserva.fecha &&
        r.hora === reserva.hora
    );

    if (yaExiste) {
      alert(`Ya existe una reserva para ${reserva.nombre} en esa fecha y hora.`);
      return;
    }

    
    const mesaOcupada = reservas.find(
      (r) => r.mesa === reserva.mesa && r.fecha === reserva.fecha && r.hora === reserva.hora
    );

    if (mesaOcupada) {
      alert(`La ${reserva.mesa} ya está reservada en esa fecha y hora.`);
      return;
    }

    const nuevoCodigo = `R-${Math.floor(100000 + Math.random() * 900000)}`;
    const nuevaReserva = { ...reserva, codigo: nuevoCodigo };

    localStorage.setItem('reservas', JSON.stringify([...reservas, nuevaReserva]));
    alert(`Reserva creada con código: ${nuevoCodigo}`);

    setReserva({
      nombre: '',
      correo: '',
      telefono: '',
      fecha: '',
      hora: '',
      mesa: '',
    });
  };

  return (
    <div className="crear-reserva-admin">
      <h2>Crear Reserva Manual</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nombre:</label>
          <input type="text" name="nombre" value={reserva.nombre} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Correo:</label>
          <input type="email" name="correo" value={reserva.correo} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Teléfono:</label>
          <input type="tel" name="telefono" value={reserva.telefono} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Fecha:</label>
          <input type="date" name="fecha" value={reserva.fecha} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Hora:</label>
          <input type="time" name="hora" value={reserva.hora} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Mesa:</label>
          <select name="mesa" value={reserva.mesa} onChange={handleChange} required>
            <option value="">Seleccionar Mesa</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={`Mesa ${i + 1}`}>{`Mesa ${i + 1}`}</option>
            ))}
          </select>
        </div>
        <button type="submit">Crear Reserva</button>
      </form>
    </div>
  );
};

export default CrearReservaAdmin;

