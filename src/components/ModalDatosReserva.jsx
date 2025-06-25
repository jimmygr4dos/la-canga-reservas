import React, { useState } from 'react';

function ModalDatosReserva({ isOpen, onClose, onSiguiente }) {
  const [reserva, setReserva] = useState({
    local: '',
    fecha: '',
    hora: ''
  });

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datosCliente = JSON.parse(localStorage.getItem('datosCliente')) || {};
    if (!datosCliente.nombre || !datosCliente.correo || !datosCliente.telefono) {
      alert('Faltan datos del cliente. Por favor vuelve a iniciar la reserva.');
      onClose();
      return;
    }

    const nombreCliente = datosCliente.nombre.toLowerCase();
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    // Validar duplicado por nombre + fecha + hora
    const duplicado = reservas.find(
      (r) =>
        r.nombre?.toLowerCase() === nombreCliente &&
        r.fecha === reserva.fecha &&
        r.hora === reserva.hora
    );

    if (duplicado) {
      const evento = new CustomEvent('reservaExistente', {
        detail: duplicado.codigo,
      });
      window.dispatchEvent(evento);
      onClose();
      return;
    }

    // Guardar datos temporales combinando cliente + reserva
    const datosCompletos = { ...datosCliente, ...reserva };
    localStorage.setItem('reservaTemporal', JSON.stringify(datosCompletos));
    onSiguiente();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-contenido">
        <span className="cerrar-modal" onClick={onClose}>&times;</span>
        <h2>Selecciona tu reserva</h2>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="local">Selecciona el local:</label>
            <select name="local" value={reserva.local} onChange={handleChange} required>
              <option value="">-- Selecciona --</option>
              <option value="Banda de Shilcayo">Banda de Shilcayo</option>
              <option value="Morales">Morales</option>
              <option value="Tarapoto">Tarapoto</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="fecha">Fecha:</label>
            <input type="date" name="fecha" value={reserva.fecha} onChange={handleChange} required />
          </div>
          <div className="campo">
            <label htmlFor="hora">Hora:</label>
            <input type="time" name="hora" value={reserva.hora} onChange={handleChange} required />
          </div>
          <div className="acciones">
            <button type="submit" className="siguiente">Escoge tu mesa</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalDatosReserva;


