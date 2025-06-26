import React, { useState } from 'react';

function ModalDatosCliente({ isOpen, onClose, onSiguiente, onCancelar }) {
  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    telefono: ''
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const nombreLower = datos.nombre.toLowerCase();
    const correoLower = datos.correo.toLowerCase();
    const telefono = datos.telefono;

    const duplicado = reservas.find((r) =>
      r.nombre?.toLowerCase() === nombreLower ||
      r.correo?.toLowerCase() === correoLower ||
      r.telefono === telefono
    );

    if (duplicado) {
      localStorage.setItem('reservaFinal', JSON.stringify(duplicado)); // clave para ModalYaReservado
      const evento = new CustomEvent('reservaExistente', {
        detail: duplicado.codigo,
      });
      window.dispatchEvent(evento);
      return;
    }

    localStorage.setItem('datosCliente', JSON.stringify(datos));
    onSiguiente();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-contenido">
        <span className="cerrar-modal" onClick={onClose}>&times;</span>
        <h2>Datos del Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} required />
          </div>
          <div className="campo">
            <label htmlFor="correo">Correo:</label>
            <input type="email" name="correo" value={datos.correo} onChange={handleChange} required />
          </div>
          <div className="campo">
            <label htmlFor="telefono">Teléfono:</label>
            <input type="tel" name="telefono" value={datos.telefono} onChange={handleChange} required />
          </div>
          <div className="acciones">
            <button type="submit">Siguiente</button>
            <button type="button" onClick={onCancelar}>Cancelar Reserva</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalDatosCliente;


