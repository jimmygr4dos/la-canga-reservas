import React, { useState, useEffect } from 'react';

const ModalSeleccionMesa = ({ isOpen, onClose, onReservaCompleta }) => {
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (isOpen) {
      const data = JSON.parse(localStorage.getItem('reservaTemporal')) || {};
      const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];

      setFecha(data.fecha || '');
      setHora(data.hora || '');
      setNombre(data.nombre || '');
      setReservas(reservasGuardadas);
    }
  }, [isOpen]);

  const generarCodigo = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `R-${random}`;
  };

  const confirmarReserva = () => {
    if (!mesaSeleccionada) {
      alert('Por favor, selecciona una mesa.');
      return;
    }

    const cliente = JSON.parse(localStorage.getItem('datosCliente')) || {};

    const yaExiste = reservas.find(
      (res) =>
        res.nombre?.toLowerCase() === cliente.nombre?.toLowerCase() &&
        res.fecha === fecha &&
        res.hora === hora
    );

    if (yaExiste) {
      const evento = new CustomEvent('reservaExistente', {
        detail: yaExiste.codigo,
      });
      window.dispatchEvent(evento);
      onClose();
      return;
    }

    const nuevoCodigo = generarCodigo();
    const nuevaReserva = {
      codigo: nuevoCodigo,
      nombre: cliente.nombre || '',
      correo: cliente.correo || '',
      telefono: cliente.telefono || '',
      fecha,
      hora,
      mesa: mesaSeleccionada,
    };

    const nuevasReservas = [...reservas, nuevaReserva];
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    localStorage.setItem('reservaActiva', JSON.stringify(nuevaReserva));

    onReservaCompleta(nuevoCodigo);
  };

  const mesas = Array.from({ length: 12 }, (_, i) => `Mesa ${i + 1}`);

  const obtenerEstadoMesa = (mesa) => {
    const ocupada = reservas.find(
      (res) => res.fecha === fecha && res.hora === hora && res.mesa === mesa
    );
    if (ocupada) return 'mesa-ocupada';
    if (mesa === mesaSeleccionada) return 'mesa-seleccionada';
    return 'mesa-disponible';
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-contenido">
        <span className="cerrar-modal" onClick={onClose}>
          &times;
        </span>
        <h2>Selecciona tu mesa</h2>
        <div className="leyenda">
          <span className="mesa-disponible">Disponible</span>
          <span className="mesa-ocupada">Ocupada</span>
          <span className="mesa-seleccionada">Seleccionada</span>
        </div>
        <div className="plano">
          <div className="plano-mesas">
            {mesas.map((mesa) => {
              const estado = obtenerEstadoMesa(mesa);
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
        <button className="boton-reservar-final" onClick={confirmarReserva}>
          Confirmar Reserva
        </button>
      </div>
    </div>
  );
};

export default ModalSeleccionMesa;





