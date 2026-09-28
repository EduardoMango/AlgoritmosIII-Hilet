import React from 'react';
import type { IndicadorEstadoProps } from '../../types';

/**
 * Componente IndicadorEstado: Componente Funcional Puro.
 * Demuestra una función determinista y sin efectos secundarios en el render.
 */
export const IndicadorEstado: React.FC<IndicadorEstadoProps> = ({
  estado,
  tipo = 'activo',
}) => {
  return (
    <span className={`insignia-estado insignia-${tipo}`}>
      <span className="punto-estado" />
      Servidor: <strong>{estado}</strong>
    </span>
  );
};

export default IndicadorEstado;

