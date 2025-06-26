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

  useEffect(() => {
    const detectarDuplicado = (e) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      localStorage.setItem('reservaFinal', JSON.stringify({ codigo: e.detail }));
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

      <ModalDatosCliente
        isOpen={modalVisible === 'cliente'}
        onClose={cerrarModal}
        onSiguiente={() => abrirModal('reserva')}
        onCancelar={() => abrirModal('eliminar')}
      />

      <ModalDatosReserva
        isOpen={modalVisible === 'reserva'}
        onClose={cerrarModal}
        onSiguiente={() => abrirModal('mesas')}
      />

      <ModalSeleccionMesa
        isOpen={modalVisible === 'mesas'}
        onClose={cerrarModal}
        onReservaCompleta={handleReservaCompleta}
      />

      <ModalYaReservado
        isOpen={modalVisible === 'yaReservado'}
        onClose={cerrarModal}
        codigo={codigoReserva}
        onNuevaReserva={iniciarNuevaReserva}
      />

      <ModalEliminarReserva
        isOpen={modalVisible === 'eliminar'}
        onClose={cerrarModal}
      />
    </>
  );
}

export default App;
