import React from 'react';

function SectionLocales() {
  return (
    <section className="locales">
      <h2>Nuestros Locales</h2>
      <div className="seccion-imagenes">
        <div className="item">
          <img src="/imagenes/local1.png" alt="Banda de Shilcayo" />
          <p>
            <strong>La Canga Banda de Shilcayo</strong><br />
            Ex Carretera Marginal Sur 161
          </p>
        </div>
        <div className="item">
          <img src="/imagenes/local2.png" alt="Morales" />
          <p>
            <strong>La Canga Morales</strong><br />
            Jr. Perú 321
          </p>
        </div>
        <div className="item">
          <img src="/imagenes/local3.png" alt="Tarapoto" />
          <p>
            <strong>La Canga Tarapoto</strong><br />
            Jr. Martínez de Compagñion 309
          </p>
        </div>
      </div>
    </section>
  );
}

export default SectionLocales;
