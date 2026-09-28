import React from 'react';
import type { TarjetaProductoProps } from '../../types';

/**
 * Componente TarjetaProducto: Ejemplifica el contrato estricto de entrada
 * mediante interface de TypeScript, props opcionales y renderizado condicional.
 */
export const TarjetaProducto: React.FC<TarjetaProductoProps> = ({
  id,
  titulo,
  precio,
  disponible = true,
}) => {
  return (
    <article className="tarjeta-producto" data-id={id}>
      <div className="tarjeta-header">
        <span className="producto-id">#{id}</span>
        <span className={`estado-stock ${disponible ? 'en-stock' : 'agotado'}`}>
          {disponible ? 'En Stock' : 'Agotado'}
        </span>
      </div>
      <h3 className="producto-titulo">{titulo}</h3>
      <p className="producto-precio">Precio: ${precio.toFixed(2)}</p>
    </article>
  );
};

export default TarjetaProducto;

