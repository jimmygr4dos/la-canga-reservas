import React, { useState } from 'react';

function ModalEliminarReserva({ isOpen, onClose }) {
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [codigoInvalido, setCodigoInvalido] = useState(false);

  const manejarEliminacion = () => {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const nuevaLista = reservas.filter((r) => r.codigo !== codigoIngresado);

    if (reservas.length !== nuevaLista.length) {
      localStorage.setItem('reservas', JSON.stringify(nuevaLista));
      alert('Reserva cancelada correctamente.');
      setCodigoInvalido(false);
      onClose();
    } else {
      setCodigoInvalido(true);
    }
  };

  const cerrarYResetear = () => {
    setCodigoIngresado('');
    setCodigoInvalido(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal" id="modal-eliminar-reserva">
      <div className="modal-contenido">
        <span className="cerrar-modal" onClick={cerrarYResetear}>&times;</span>
        <h2>Cancelar Reserva</h2>
        <p>Ingresa tu código de reserva para cancelarla:</p>

        <input
          id="codigo-eliminar"
          type="text"
          placeholder="Ej. ABC123"
          value={codigoIngresado}
          onChange={(e) => setCodigoIngresado(e.target.value.toUpperCase())}
          className={codigoInvalido ? 'invalido' : ''}
        />

        {codigoInvalido && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            Código incorrecto. Verifica e intenta nuevamente.
          </p>
        )}

        <div className="acciones">
          <button id="btn-eliminar-confirmar" onClick={manejarEliminacion}>
            Cancelar Reserva
          </button>
          <button id="btn-eliminar-cerrar" onClick={cerrarYResetear}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminarReserva;
