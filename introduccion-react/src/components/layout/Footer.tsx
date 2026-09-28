import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p className="footer-copy">
          Cátedra de Gestión de Desarrollo de Software / Algoritmos y Programación III.
        </p>
        <p className="footer-note">
          Proyecto base demostrativo alineado con el apunte oficial{' '}
          <code>dist/apuntes/bloque_01_filosofia_y_componentes.html</code>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

