import React, { useState } from 'react';
import { useUser } from '../UserContext';

const AdminLogin = () => {
  const { logueado, login } = useUser();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const resultado = login(usuario, clave);
    if (!resultado.exito) setError(resultado.mensaje);
  };

  if (logueado) return null;

  return (
    <div className="modal">
      <div className="modal-contenido" style={{ maxWidth: '400px', margin: 'auto' }}>
        <h2>Login Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label>Usuario:</label>
            <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          </div>
          <div className="campo">
            <label>Contraseña:</label>
            <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} required />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
