import { useState, useEffect } from 'react';
import './styles/estilos.css';
import Header from './components/Header';
import Banner from './components/Banner';
import SectionCarta from './components/SectionCarta';
import SectionFavoritos from './components/SectionFavoritos';
import SectionLocales from './components/SectionLocales';
import Footer from './components/Footer';

import ModalDatosCliente from './components/ModalDatosCliente';
import ModalDatosReserva from './components/ModalDatosReserva';
import ModalSeleccionMesa from './components/ModalSeleccionMesa';
import ModalYaReservado from './components/ModalYaReservado';
import ModalEliminarReserva from './components/ModalEliminarReserva';

function App() {
  const [modalVisible, setModalVisible] = useState(null);
  const [codigoReserva, setCodigoReserva] = useState('');

  const abrirModal = (modal) => setModalVisible(modal);
  const cerrarModal = () => setModalVisible(null);

  const handleReservaCompleta = (codigoGenerado) => {
    setCodigoReserva(codigoGenerado);
    abrirModal('yaReservado');
  };

  const iniciarNuevaReserva = () => {
    setCodigoReserva('');
    abrirModal('cliente');
  };

  // Escucha de evento reservaExistente (en caso de duplicados)
  useEffect(() => {
    const detectarDuplicado = (e) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      setTimeout(() => {
        setCodigoReserva(e.detail);
        setModalVisible('yaReservado');
      }, 0);
    };

    window.addEventListener('reservaExistente', detectarDuplicado);
    return () => {
      window.removeEventListener('reservaExistente', detectarDuplicado);
    };
  }, []);

  return (
    <>
      <Header onReservaClick={() => abrirModal('cliente')} />
      <Banner />
      <SectionCarta />
      <SectionFavoritos />
      <SectionLocales />
      <Footer />

      {/* Modal 1: Datos del Cliente */}
      <ModalDatosCliente
        isOpen={modalVisible === 'cliente'}
        onClose={cerrarModal}
        onSiguiente={() => abrirModal('reserva')}
        onCancelar={() => abrirModal('eliminar')}
      />

      {/* Modal 2: Datos de Reserva */}
      <ModalDatosReserva
        isOpen={modalVisible === 'reserva'}
        onClose={cerrarModal}
        onSiguiente={() => abrirModal('mesas')}
      />

      {/* Modal 3: Selección de Mesa */}
      <ModalSeleccionMesa
        isOpen={modalVisible === 'mesas'}
        onClose={cerrarModal}
        onReservaCompleta={handleReservaCompleta}
      />

      {/* Modal 4: Ya Reservado */}
      <ModalYaReservado
        isOpen={modalVisible === 'yaReservado'}
        onClose={cerrarModal}
        codigo={codigoReserva}
        onNuevaReserva={iniciarNuevaReserva}
      />

      {/* Modal 5: Eliminar Reserva */}
      <ModalEliminarReserva
        isOpen={modalVisible === 'eliminar'}
        onClose={cerrarModal}
      />
    </>
  );
}

export default App;







