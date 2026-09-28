import React, { useState } from 'react';
import Header from './components/layout/Header';
import Navbar, { type TabId } from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FilosofiaSection from './components/sections/FilosofiaSection';
import SintaxisJsxSection from './components/sections/SintaxisJsxSection';
import ComponentesPropsSection from './components/sections/ComponentesPropsSection';
import ComposicionChildrenSection from './components/sections/ComposicionChildrenSection';
import ComparativaSection from './components/sections/ComparativaSection';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('todos');

  return (
    <div className="app-layout">
      <Header />
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="app-main-content">
        <div className="container">
          {/* Banner de bienvenida y propósito pedagógico */}
          <section className="banner-introductorio">
            <div className="banner-icono">🚀</div>
            <div className="banner-texto">
              <h2>Primer Acercamiento a la Arquitectura React</h2>
              <p>
                Este proyecto interactivo materializa de forma íntegra los conceptos abordados en el apunte teórico{' '}
                <strong>Bloque 1: Filosofía de React, Arquitectura y Componentes Básicos</strong>.
                Permite experimentar en tiempo real con componentes puros, tipado estático TSX, inmutabilidad de props
                y composición mediante <code>children</code>.
              </p>
            </div>
          </section>

          {/* Renderizado condicional según la pestaña seleccionada */}
          {(activeTab === 'todos' || activeTab === 'filosofia') && <FilosofiaSection />}
          {(activeTab === 'todos' || activeTab === 'jsx') && <SintaxisJsxSection />}
          {(activeTab === 'todos' || activeTab === 'componentes') && <ComponentesPropsSection />}
          {(activeTab === 'todos' || activeTab === 'children') && <ComposicionChildrenSection />}
          {(activeTab === 'todos' || activeTab === 'comparativa') && <ComparativaSection />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;

