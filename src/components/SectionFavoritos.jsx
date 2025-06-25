import React from 'react';

function SectionFavoritos() {
  return (
    <section className="favoritos">
      <h2>Favoritos</h2>
      <div className="seccion-imagenes">
        <div className="item">
          <img src="/imagenes/favorito1.png" alt="1/8 Brasa" />
          <p>1/8 Brasa + Guarnición + Ensalada<br /><small>Desde S/. 15.00</small></p>
        </div>
        <div className="item">
          <img src="/imagenes/favorito2.png" alt="1 Pollo a la Brasa" />
          <p>1 Pollo a la Brasa + 2 Guarniciones + Ensalada<br /><small>Desde S/. 69.50</small></p>
        </div>
        <div className="item">
          <img src="/imagenes/favorito3.png" alt="1/2 Brasa" />
          <p>1/2 Brasa + Guarnición + Ensalada<br /><small>Desde S/. 39.50</small></p>
        </div>
        <div className="item">
          <img src="/imagenes/favorito4.png" alt="1/4 Brasa" />
          <p>1/4 Brasa + Guarnición + Ensalada<br /><small>Desde S/. 20.00</small></p>
        </div>
      </div>
    </section>
  );
}

export default SectionFavoritos;
