// src/components/ModalYaReservado.jsx
import React from 'react';

function ModalYaReservado({
  isOpen,
  onClose,
  onNuevaReserva,        // opcional
  codigo,                // opcional
  titulo = 'RESERVA REALIZADA',
  mensaje = '¡Tu reserva fue exitosa!',
}) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-contenido" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px', color: '#8B0000' }}>{titulo}</h2>

        {mensaje && <p style={{ fontSize: '1.1rem' }}>{mensaje}</p>}

        {codigo && (
          <>
            <p style={{ margin: '1rem 0' }}>Tu código de reserva es:</p>
            <p>
              <strong id="codigo-reserva" style={{ fontSize: '1.8rem', color: '#006400' }}>
                #{codigo}
              </strong>
            </p>
          </>
        )}

        <div
          className="acciones"
          style={{ flexDirection: 'column', gap: '10px', marginTop: '1.5rem' }}
        >
          {typeof onNuevaReserva === 'function' && (
            <button onClick={onNuevaReserva}>Nueva Reserva</button>
          )}
          <button onClick={onClose} style={{ backgroundColor: '#666' }}>Finalizar</button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <img src="/imagenes/logo.avif" alt="La Canga" className="logo" style={{ height: '70px' }} />
        </div>
      </div>
    </div>
  );
}

export default ModalYaReservado;


