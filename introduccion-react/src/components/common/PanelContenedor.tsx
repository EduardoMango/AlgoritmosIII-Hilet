import React from 'react';
import type { PanelContenedorProps } from '../../types';

/**
 * Componente PanelContenedor: Demuestra el patrón de Composición mediante la
 * propiedad reservada `props.children` y el tipado con `React.ReactNode`.
 */
export const PanelContenedor: React.FC<PanelContenedorProps> = ({
  titulo,
  subtitulo,
  children,
}) => {
  return (
    <section className="panel-bordeado">
      <header className="panel-cabecera">
        <div>
          <h3 className="panel-titulo">{titulo}</h3>
          {subtitulo && <p className="panel-subtitulo">{subtitulo}</p>}
        </div>
      </header>
      <main className="panel-cuerpo">
        {children}
      </main>
    </section>
  );
};

export default PanelContenedor;

