import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CrearReservaAdmin from '../../admin/CrearReservaAdmin';

// Mock de la config de Firebase para que el componente pueda importar { db }
jest.mock('../../firebase/firebaseConfig', () => ({
  db: {}, // objeto dummy, no se usa directamente en el test
}));

// Mock de Firestore: define funciones DENTRO del factory de jest.mock
jest.mock('firebase/firestore', () => {
  const addDoc = jest.fn(async () => ({}));
  const getDocs = jest.fn(async () => ({ docs: [] })); // sin conflictos por defecto
  const collection = jest.fn();
  return { addDoc, getDocs, collection };
});

test('crea una reserva y muestra el modal de éxito', async () => {
  render(<CrearReservaAdmin />);

  fireEvent.change(screen.getByLabelText(/Nombre:/i),   { target: { value: 'Juan' } });
  fireEvent.change(screen.getByLabelText(/Correo:/i),   { target: { value: 'juan@mail.com' } });
  fireEvent.change(screen.getByLabelText(/Teléfono:/i), { target: { value: '999999999' } });
  fireEvent.change(screen.getByLabelText(/Fecha:/i),    { target: { value: '2025-08-20' } });
  fireEvent.change(screen.getByLabelText(/Hora:/i),     { target: { value: '19:00' } });
  fireEvent.change(screen.getByLabelText(/Mesa:/i),     { target: { value: 'Mesa 1' } });

  fireEvent.click(screen.getByRole('button', { name: /Crear Reserva/i }));

  // El modal de éxito debe abrirse (reutiliza ModalYaReservado internamente)
  await waitFor(() => {
    expect(screen.getByText(/RESERVA REALIZADA/i)).toBeInTheDocument();
  });
});
