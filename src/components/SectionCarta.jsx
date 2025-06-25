import React from 'react';

function SectionCarta() {
  return (
    <section className="carta">
      <h2>Nuestra Carta</h2>
      <div className="seccion-imagenes">
        <div className="item">
          <img src="/imagenes/combos.png" alt="Combos" />
          <p><strong>Combos</strong></p>
        </div>
        <div className="item">
          <img src="/imagenes/brasas.png" alt="Brasas" />
          <p><strong>Brasas</strong></p>
        </div>
        <div className="item">
          <img src="/imagenes/parrillas.png" alt="Parrillas" />
          <p><strong>Parrillas</strong></p>
        </div>
      </div>
    </section>
  );
}

export default SectionCarta;
