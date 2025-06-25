import React, { useEffect, useState } from 'react';
import '../styles/estilos.css';

const ReservasAnuladas = () => {
  const [anuladas, setAnuladas] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('reservasAnuladas')) || [];
    setAnuladas(data);
  }, []);

  const eliminarAnulada = (codigo) => {
    const nuevas = anuladas.filter((r) => r.codigo !== codigo);
    localStorage.setItem('reservasAnuladas', JSON.stringify(nuevas));
    setAnuladas(nuevas);
  };

  return (
    <div className="listado-reservas">
      <h2>Reservas Anuladas</h2>
      {anuladas.length === 0 ? (
        <p>No hay reservas anuladas.</p>
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
            {anuladas.map((r, index) => (
              <tr key={index}>
                <td>{r.nombre || '-'}</td>
                <td>{r.correo || '-'}</td>
                <td>{r.telefono || '-'}</td>
                <td>{r.fecha || '-'}</td>
                <td>{r.hora || '-'}</td>
                <td>{r.mesa || '-'}</td>
                <td>{r.codigo}</td>
                <td>
                  <button className="btn-rojo" onClick={() => eliminarAnulada(r.codigo)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservasAnuladas;
