import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [logueado, setLogueado] = useState(false);

  const login = (usuario, clave) => {
    if (usuario === 'admin' && clave === '1234') {
      setLogueado(true);
      return { ok: true };
    } else {
      return { ok: false, mensaje: 'Credenciales incorrectas' };
    }
  };

  const logout = () => setLogueado(false);

  return (
    <UserContext.Provider value={{ logueado, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

