import React from 'react';

function Header({ onReservaClick }) {
  return (
    <header>
      <img src="/imagenes/logo.avif" alt="La Canga" className="logo" />
      <nav>
        <a href="#">Entradas</a>
        <a href="#">Brasas</a>
        <a href="#">Alitas y Parrillas</a>
        <a href="#">Combos</a>
        <a href="#">Tradicionales</a>
        <a href="#">Guarniciones</a>
        <a href="#">Ensaladas</a>
        <a href="#">Bebidas</a>
      </nav>
      <button className="reserva-btn" onClick={onReservaClick}>
        Reserva
      </button>
    </header>
  );
}

export default Header;

