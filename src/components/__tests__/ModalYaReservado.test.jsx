import { render, screen, fireEvent } from '@testing-library/react';
import ModalYaReservado from '../ModalYaReservado'; // componente está en src/components

test('muestra código cuando isOpen y cierra al pulsar Finalizar', () => {
  const onClose = jest.fn();

  render(<ModalYaReservado isOpen onClose={onClose} codigo="R-000001" />);

  // se ve el código
  expect(screen.getByText(/R-000001/i)).toBeInTheDocument();

  // cierra
  fireEvent.click(screen.getByText(/Finalizar/i));
  expect(onClose).toHaveBeenCalled();
});
