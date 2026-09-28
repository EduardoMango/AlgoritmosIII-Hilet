import React from 'react';
import type { BotonAccionProps } from '../../types';

/**
 * Componente BotonAccion: Demuestra el uso de Destructuring, 
 * valores por defecto (Default Parameters) y tipado estático con TSX.
 */
export const BotonAccion: React.FC<BotonAccionProps> = ({
  texto = 'Aceptar',
  variante = 'primario',
  deshabilitado = false,
  onClick,
}) => {
  const claseCss = `btn btn-${variante} ${deshabilitado ? 'btn-disabled' : ''}`;

  return (
    <button
      type="button"
      className={claseCss}
      disabled={deshabilitado}
      onClick={onClick}
    >
      {texto}
    </button>
  );
};

export default BotonAccion;

