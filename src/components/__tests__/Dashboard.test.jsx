import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../admin/Dashboard';

// 👉 Mock del UserContext para forzar logueado = true
jest.mock('../../UserContext', () => {
  const React = require('react');
  const Ctx = React.createContext({ logueado: true, login: jest.fn(), logout: jest.fn() });
  return {
    useUser: () => React.useContext(Ctx),
    UserProvider: ({ children }) => (
      <Ctx.Provider value={{ logueado: true, login: jest.fn(), logout: jest.fn() }}>
        {children}
      </Ctx.Provider>
    ),
  };
});

// 👉 Mock Firestore: onSnapshot devuelve lista vacía y no rompe
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: (col, cb) => {
    cb({ docs: [] });      // sin reservas
    return jest.fn();      // función de desuscripción
  },
  getDocs: jest.fn(async () => ({ docs: [] })),
}));

// 👉 Mock de db
jest.mock('../../firebase/firebaseConfig', () => ({ db: {} }));

test('renderiza el Panel de Administración', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
});
