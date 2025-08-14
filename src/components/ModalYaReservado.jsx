// src/components/ModalYaReservado.jsx
import React, { useEffect, useRef } from 'react';

function ModalYaReservado({
  isOpen,
  onClose,
  onNuevaReserva,                 // opcional
  // Props “estándar”
  codigo,
  titulo = 'RESERVA REALIZADA',
  mensaje = '¡Tu reserva fue exitosa!',
  // Props alternos (compatibilidad con otros usos)
  codigoReserva,                  // alias de codigo
  tituloPersonalizado,            // alias de titulo
  mensajePersonalizado,           // alias de mensaje
}) {
  const dialogRef = useRef(null);

  // Normalización de props (acepta ambos nombres)
  const codigoFinal = codigo ?? codigoReserva;
  const tituloFinal = tituloPersonalizado ?? titulo;
  const mensajeFinal = mensajePersonalizado ?? mensaje;

  // Cerrar con ESC y bloquear scroll del body al abrir
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);

    // Bloquear scroll de fondo
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Cerrar si hago click en el backdrop
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-yareservado-title"
      onMouseDown={onBackdropClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        ref={dialogRef}
        className="modal-contenido"
        style={{
          textAlign: 'center',
          maxWidth: 480,
          width: '100%',
          borderRadius: 12,
        }}
      >
        <h2
          id="modal-yareservado-title"
          style={{ marginBottom: '10px', color: '#8B0000' }}
        >
          {tituloFinal}
        </h2>

        {mensajeFinal && (
          <p style={{ fontSize: '1.05rem', lineHeight: 1.4 }}>{mensajeFinal}</p>
        )}

        {codigoFinal && (
          <>
            <p style={{ margin: '1rem 0 0.25rem' }}>Tu código de reserva es:</p>
            <p>
              <strong
                id="codigo-reserva"
                style={{ fontSize: '1.8rem', color: '#006400' }}
              >
                #{codigoFinal}
              </strong>
            </p>
          </>
        )}

        <div
          className="acciones"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '1.5rem',
          }}
        >
          {typeof onNuevaReserva === 'function' && (
            <button onClick={onNuevaReserva}>Nueva Reserva</button>
          )}
          <button onClick={onClose} style={{ backgroundColor: '#666' }}>
            Finalizar
          </button>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <img
            src="/imagenes/logo.avif"
            alt="La Canga"
            className="logo"
            style={{ height: 64, objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ModalYaReservado;


