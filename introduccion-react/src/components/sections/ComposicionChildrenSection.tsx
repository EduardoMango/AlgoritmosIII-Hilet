import React, { useState } from 'react';
import PanelContenedor from '../common/PanelContenedor';
import BotonAccion from '../common/BotonAccion';
import TarjetaProducto from '../common/TarjetaProducto';

export const ComposicionChildrenSection: React.FC = () => {
  const [ejemploActivo, setEjemploActivo] = useState<'metricas' | 'catalogo' | 'formulario'>('metricas');

  return (
    <section className="seccion-bloque" id="children">
      <div className="seccion-header">
        <span className="seccion-numero">Tema 1.4</span>
        <h2>Composición de Componentes mediante la Propiedad <code>children</code></h2>
      </div>

      {/* Concepto de composición */}
      <div className="card-conceptual">
        <h3>1. Composición por sobre Herencia en React</h3>
        <p>
          En la arquitectura frontend moderna, React favorece el patrón de <strong>composición</strong> antes que la herencia
          para reutilizar lógica y vistas. La pieza angular de este patrón es la propiedad especial y reservada <code>children</code>.
        </p>

        <div className="grid-explicacion-children">
          <div className="tarjeta-info">
            <strong>¿Qué es <code>children</code>?</strong>
            <p>
              Representa todo el contenido que un componente padre inyecta entre la etiqueta de apertura y cierre
              de un componente hijo (<code>&lt;Contenedor&gt; ... &lt;/Contenedor&gt;</code>).
            </p>
          </div>
          <div className="tarjeta-info">
            <strong>Tipado Estricto en TSX</strong>
            <p>
              Se tipa formalmente mediante <code>React.ReactNode</code> (proveniente de <code>@types/react</code>),
              el cual admite cualquier elemento renderizable: strings, números, elementos JSX o fragmentos.
            </p>
          </div>
        </div>
      </div>

      {/* Patrón Contenedor Wrapper */}
      <div className="card-conceptual">
        <h3>2. Patrón de Contenedor Reutilizable (Wrapper Pattern)</h3>
        <p>
          El componente contenedor actúa como un marco estructural agnóstico: provee la estructura HTML externa,
          bordes, cabeceras o estilos, pero <strong>no conoce de antemano el contenido específico</strong> que albergará.
        </p>

        <div className="comparativa-codigo-grid">
          <div className="bloque-codigo">
            <div className="codigo-cabecera">
              <span>Definición de PanelContenedor (TSX)</span>
            </div>
            <pre>
              <code>{`import type { ReactNode } from "react";

interface PanelContenedorProps {
  titulo: string;
  subtitulo?: string;
  children: ReactNode; // Inyección de contenido
}

function PanelContenedor({ titulo, subtitulo, children }: PanelContenedorProps) {
  return (
    <section className="panel-bordeado">
      <header className="panel-cabecera">
        <h3>{titulo}</h3>
      </header>
      <main className="panel-cuerpo">
        {children} {/* Se renderiza dinámicamente */}
      </main>
    </section>
  );
}`}</code>
            </pre>
          </div>

          <div className="bloque-codigo">
            <div className="codigo-cabecera">
              <span>Invocación desde el Padre</span>
            </div>
            <pre>
              <code>{`<PanelContenedor titulo="Métricas de Rendimiento">
  {/* Todo este contenido se inyecta en props.children */}
  <p>El uso medio de la CPU se mantiene en 42%.</p>
  <BotonAccion texto="Exportar PDF" variante="secundario" />
</PanelContenedor>`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Demostración Interactiva de Composición Flexible */}
      <div className="card-conceptual">
        <h3>3. Demostración Interactiva: Mismo Contenedor, Múltiples Usos</h3>
        <p className="subtexto">
          Seleccione qué tipo de contenido desea componer dentro del mismo componente <code>PanelContenedor</code>:
        </p>

        <div className="selector-tabs-demo">
          <button
            type="button"
            className={`tab-btn-demo ${ejemploActivo === 'metricas' ? 'activo' : ''}`}
            onClick={() => setEjemploActivo('metricas')}
          >
            📊 Ejemplo A: Métricas del Sistema
          </button>
          <button
            type="button"
            className={`tab-btn-demo ${ejemploActivo === 'catalogo' ? 'activo' : ''}`}
            onClick={() => setEjemploActivo('catalogo')}
          >
            🛒 Ejemplo B: Tarjetas de Catálogo
          </button>
          <button
            type="button"
            className={`tab-btn-demo ${ejemploActivo === 'formulario' ? 'activo' : ''}`}
            onClick={() => setEjemploActivo('formulario')}
          >
            📝 Ejemplo C: Formulario de Acción
          </button>
        </div>

        <div className="render-composicion-box">
          {ejemploActivo === 'metricas' && (
            <PanelContenedor
              titulo="Métricas de Rendimiento del Servidor"
              subtitulo="Datos sincronizados en tiempo real mediante infraestructura React"
            >
              <div className="metricas-contenido">
                <div className="stat-item">
                  <span className="stat-label">Uso medio de CPU</span>
                  <span className="stat-valor">42%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Memoria Heap</span>
                  <span className="stat-valor">184 MB / 512 MB</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Peticiones / seg</span>
                  <span className="stat-valor">1.250 req/s</span>
                </div>
              </div>
              <div className="panel-footer-acciones">
                <BotonAccion texto="Exportar Reporte PDF" variante="secundario" />
                <BotonAccion texto="Refrescar Métricas" variante="primario" />
              </div>
            </PanelContenedor>
          )}

          {ejemploActivo === 'catalogo' && (
            <PanelContenedor
              titulo="Catálogo de Productos de Hardware"
              subtitulo="Composición anidando componentes hijos TarjetaProducto"
            >
              <div className="catalogo-grid">
                <TarjetaProducto id={201} titulo="Teclado Mecánico RGB" precio={89.99} disponible={true} />
                <TarjetaProducto id={202} titulo="Mouse Óptico 16000 DPI" precio={45.5} disponible={true} />
                <TarjetaProducto id={203} titulo="Auriculares Hi-Res Inalámbricos" precio={120.0} disponible={false} />
              </div>
            </PanelContenedor>
          )}

          {ejemploActivo === 'formulario' && (
            <PanelContenedor
              titulo="Configuración de Notificaciones"
              subtitulo="Inyección de marcado HTML estándar combinado con componentes"
            >
              <form className="form-composicion" onSubmit={(e) => e.preventDefault()}>
                <div className="campo-form">
                  <label htmlFor="comp-email">Correo Electrónico de Alerta:</label>
                  <input id="comp-email" type="email" defaultValue="admin@infraestructura.edu.ar" />
                </div>
                <div className="campo-form">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    Recibir reportes críticos de rendimiento
                  </label>
                </div>
                <div className="panel-footer-acciones">
                  <BotonAccion texto="Guardar Preferencias" variante="exito" />
                </div>
              </form>
            </PanelContenedor>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComposicionChildrenSection;

