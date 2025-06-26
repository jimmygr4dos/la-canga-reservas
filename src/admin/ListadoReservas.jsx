import React, { useEffect, useState } from 'react';
import '../styles/estilos.css';

const ListadoReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = () => {
    const data = JSON.parse(localStorage.getItem('reservas')) || [];
    setReservas(data);
  };

  const anularReserva = (codigo) => {
    const todas = JSON.parse(localStorage.getItem('reservas')) || [];
    const anuladas = JSON.parse(localStorage.getItem('reservasAnuladas')) || [];

    const reservaAnular = todas.find((r) => r.codigo === codigo);
    if (!reservaAnular) return;

    const reservaCompleta = {
      nombre: reservaAnular.nombre || '-',
      correo: reservaAnular.correo || '-',
      telefono: reservaAnular.telefono || '-',
      fecha: reservaAnular.fecha || '-',
      hora: reservaAnular.hora || '-',
      mesa: reservaAnular.mesa || '-',
      codigo: reservaAnular.codigo
    };

    const nuevasReservas = todas.filter((r) => r.codigo !== codigo);
    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    localStorage.setItem('reservasAnuladas', JSON.stringify([...anuladas, reservaCompleta]));

    cargarReservas();
  };

  return (
    <div className="listado-reservas">
      <h2>Listado de Reservas</h2>
      {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Mesa</th>
              <th>Código</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r, index) => (
              <tr key={index}>
                <td>{r.nombre || '-'}</td>
                <td>{r.correo || '-'}</td>
                <td>{r.telefono || '-'}</td>
                <td>{r.fecha || '-'}</td>
                <td>{r.hora || '-'}</td>
                <td>{r.mesa || '-'}</td>
                <td>{r.codigo}</td>
                <td>
                  <button onClick={() => anularReserva(r.codigo)}>Anular</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListadoReservas;

