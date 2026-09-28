import React, { useState } from 'react';
import BotonAccion from './BotonAccion';

interface ContadorVisualProps {
  contador: number;
}

/**
 * Componente ContadorVisual del apunte:
 * La UI se describe exclusivamente en función de la prop 'contador'.
 * UI = f(State)
 */
export const ContadorVisual: React.FC<ContadorVisualProps> = ({ contador }) => {
  const esLimite = contador >= 10;

  return (
    <div className={`contador-box ${esLimite ? 'limite-alcanzado' : ''}`}>
      <span className="contador-etiqueta">Salida Visual de la Función f(State):</span>
      <p className="contador-valor" style={{ color: esLimite ? '#e11d48' : 'var(--text-color)' }}>
        Total de elementos: <strong>{contador}</strong>
      </p>
      {esLimite && (
        <span className="alerta-limite">
          ⚠️ Umbral alcanzado (contador &ge; 10): el estilo cambió reactivamente sin manipular el DOM manualmente.
        </span>
      )}
    </div>
  );
};

/**
 * Demostración interactiva de UI = f(State) vs Enfoque Imperativo.
 */
export const ContadorDeclarativo: React.FC = () => {
  const [contador, setContador] = useState<number>(0);

  const incrementar = () => setContador((prev) => prev + 1);
  const decrementar = () => setContador((prev) => Math.max(0, prev - 1));
  const reiniciar = () => setContador(0);

  return (
    <div className="demostracion-contador">
      <div className="contador-header">
        <h4>Demostración Interactiva: Paradigma Declarativo</h4>
        <p className="subtexto">
          React recalcula la interfaz automáticamente cada vez que el estado cambia,
          garantizando la ecuación fundamental: <code>UI = f(State)</code>.
        </p>
      </div>

      <div className="contador-panel">
        <ContadorVisual contador={contador} />

        <div className="contador-acciones">
          <BotonAccion
            texto="Decrementar (-1)"
            variante="secundario"
            deshabilitado={contador === 0}
            onClick={decrementar}
          />
          <BotonAccion
            texto="Incrementar (+1)"
            variante="primario"
            onClick={incrementar}
          />
          <BotonAccion
            texto="Reiniciar"
            variante="peligro"
            deshabilitado={contador === 0}
            onClick={reiniciar}
          />
        </div>
      </div>
    </div>
  );
};

export default ContadorDeclarativo;

