import React from 'react';

function Footer() {
  return (
    <footer>
      <div>
        <img src="/imagenes/logo.avif" alt="La Canga" className="logo" />
        <p>
          La Canga cuenta con más de 28 años llevando felicidad a las familias sanmartinenses a través de nuestro sabor y pasión por la comida.<br />
          Nuestro restaurante, orgulloso de sus raíces, fusiona ingredientes locales con técnicas perfeccionadas a lo largo del tiempo.
        </p>
      </div>
      <ul>
        <li>Entradas</li>
        <li>Brasas</li>
        <li>Alitas y Parrillas</li>
        <li>Combos</li>
        <li>Regionales</li>
        <li>Guarniciones</li>
        <li>Ensaladas</li>
        <li>Bebidas</li>
      </ul>
      <div>
        <p>Derechos de autor © lacangaperu 2025</p>
      </div>
    </footer>
  );
}

export default Footer;
