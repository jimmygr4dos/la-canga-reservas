import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const RutaPrivada = ({ children }) => {
  const { logueado } = useUser();

  return logueado ? children : <Navigate to="/admin/login" />;
};

export default RutaPrivada;
