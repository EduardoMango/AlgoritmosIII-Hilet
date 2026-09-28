import React, { useState } from 'react';
import ContadorDeclarativo from '../common/ContadorDeclarativo';

export const FilosofiaSection: React.FC = () => {
  const [faseActiva, setFaseActiva] = useState<number>(1);

  const fasesVdom = [
    {
      paso: 1,
      titulo: '1. Fase de Render (Generación del VDOM)',
      desc: 'Cuando el estado de la aplicación cambia (setContador), React ejecuta los componentes afectados y construye un nuevo árbol de Virtual DOM en memoria sin tocar el DOM del navegador.',
      detalle: 'Representación liviana en JavaScript puro: objetos { type, props, children }.',
    },
    {
      paso: 2,
      titulo: '2. Fase de Reconciliación (Diffing)',
      desc: 'React compara el nuevo árbol con el anterior mediante un algoritmo heurístico lineal O(n). Identifica de manera quirúrgica qué nodos específicos cambiaron.',
      detalle: 'Evita la comparación genérica de árboles de complejidad O(n³).',
    },
    {
      paso: 3,
      titulo: '3. Fase de Commit (Aplicación en DOM Real)',
      desc: 'React calcula el conjunto mínimo de mutaciones y aplica únicamente los parches requeridos en el DOM real en una sola operación agrupada (batching).',
      detalle: 'Minimiza los procesos costosos de Reflow (geometría) y Repaint (píxeles).',
    },
  ];

  return (
    <section className="seccion-bloque" id="filosofia">
      <div className="seccion-header">
        <span className="seccion-numero">Tema 1.1</span>
        <h2>Filosofía de React y Arquitectura Frontend Moderno</h2>
      </div>

      {/* 1. Librería vs Framework */}
      <div className="card-conceptual">
        <h3>1. Naturaleza y Alcance: Librería vs. Framework</h3>
        <p>
          React es formalmente una <strong>librería de JavaScript especializada en la construcción de interfaces de usuario (UI)</strong>.
          A diferencia de los frameworks opinados (como Angular o NestJS), React no impone soluciones rígidas para enrutamiento,
          manejo de estado global ni llamadas HTTP.
        </p>
        <p>
          Esta distinción radica en el principio de <strong>Inversión de Control (IoC)</strong>: en un framework, el marco toma el control
          y llama al código del desarrollador. En React, el desarrollador conserva el control arquitectónico e invoca a la librería
          para construir la capa de vista (<em>View</em>).
        </p>

        <div className="diagrama-arquitectura">
          <div className="bloque-app">APLICACIÓN FRONTEND MODERNA</div>
          <div className="grid-ecosistema">
            <div className="celda-eco">
              <strong>Enrutamiento</strong>
              <span>React Router</span>
            </div>
            <div className="celda-eco">
              <strong>Estado Global</strong>
              <span>Zustand / Redux</span>
            </div>
            <div className="celda-eco">
              <strong>Peticiones HTTP</strong>
              <span>Fetch / Axios</span>
            </div>
            <div className="celda-eco">
              <strong>Estilos</strong>
              <span>CSS Modules / Tailwind</span>
            </div>
          </div>
          <div className="bloque-react">
            REACT (Librería de Construcción de UI - Capa de Vista)
          </div>
        </div>
      </div>

      {/* 2. Paradigma Declarativo vs Imperativo */}
      <div className="card-conceptual">
        <h3>2. Paradigma Declarativo vs. Enfoque Imperativo</h3>
        <p>
          En el <strong>enfoque imperativo</strong> (Vanilla JS), se debe especificar paso a paso <em>cómo</em> modificar el DOM
          ante cada evento (obteniendo nodos con <code>document.getElementById</code> y mutando propiedades a mano).
          Esto genera código frágil y condiciones de carrera.
        </p>
        <p>
          En el <strong>paradigma declarativo</strong> (React), se describe <em>qué</em> interfaz debe mostrarse en función
          del estado actual de los datos mediante la ecuación matemática fundamental:
        </p>

        <div className="caja-formula">
          <span className="formula-matematica">UI = f(State)</span>
          <span className="formula-explicacion">
            La interfaz (<strong>UI</strong>) es el resultado visual de aplicar la función componente (<strong>f</strong>)
            sobre el estado actual en memoria (<strong>State</strong>).
          </span>
        </div>

        {/* Comparación de código */}
        <div className="comparativa-codigo-grid">
          <div className="bloque-codigo">
            <div className="codigo-cabecera imperativo">
              <span>Vanilla JS (Imperativo)</span>
              <span className="badge-tipo">Mutación Directa</span>
            </div>
            <pre>
              <code>{`// 1. Obtención manual de nodos del DOM
const contadorElem = document.getElementById("val");
const btn = document.getElementById("btn");
let contador = 0;

// 2. Manipulación imperativa ante eventos
btn.addEventListener("click", () => {
  contador++;
  contadorElem.textContent = \`Total: \${contador}\`;
  if (contador >= 10) {
    contadorElem.style.color = "red";
  }
});`}</code>
            </pre>
          </div>

          <div className="bloque-codigo">
            <div className="codigo-cabecera declarativo">
              <span>React + TypeScript (Declarativo)</span>
              <span className="badge-tipo">UI = f(State)</span>
            </div>
            <pre>
              <code>{`// La UI se describe en función del estado
function ContadorVisual({ contador }: { contador: number }) {
  const esLimite = contador >= 10;
  return (
    <div>
      <p style={{ color: esLimite ? 'red' : 'black' }}>
        Total de elementos: {contador}
      </p>
    </div>
  );
}`}</code>
            </pre>
          </div>
        </div>

        {/* Demostración interactiva en vivo */}
        <ContadorDeclarativo />
      </div>

      {/* 3. Virtual DOM y Reconciliación */}
      <div className="card-conceptual">
        <h3>3. Virtual DOM y Algoritmo de Reconciliación (Diffing)</h3>
        <p>
          Mutar el DOM real del navegador es una de las operaciones computacionales más costosas porque provoca
          <strong>Reflow</strong> (cálculo de geometrías) y <strong>Repaint</strong> (dibujado de píxeles).
          React utiliza un <strong>Virtual DOM (VDOM)</strong>: una representación en memoria en forma de árbol de objetos JavaScript.
        </p>

        <div className="pasos-vdom-contenedor">
          <div className="tabs-vdom">
            {fasesVdom.map((fase) => (
              <button
                key={fase.paso}
                type="button"
                className={`tab-vdom-btn ${faseActiva === fase.paso ? 'activo' : ''}`}
                onClick={() => setFaseActiva(fase.paso)}
              >
                Paso {fase.paso}
              </button>
            ))}
          </div>

          <div className="vdom-tarjeta-fase">
            <h4>{fasesVdom[faseActiva - 1].titulo}</h4>
            <p className="vdom-desc">{fasesVdom[faseActiva - 1].desc}</p>
            <div className="vdom-badge-detalle">
              💡 {fasesVdom[faseActiva - 1].detalle}
            </div>
          </div>
        </div>

        <div className="vdom-diagrama-flujo">
          <div className="nodo-flujo">Árbol de Estado (A)</div>
          <div className="flecha-flujo">&rarr;</div>
          <div className="nodo-flujo">Nuevo VDOM (B)</div>
          <div className="flecha-flujo">&rarr;</div>
          <div className="nodo-flujo destacado">Diffing O(n)</div>
          <div className="flecha-flujo">&rarr;</div>
          <div className="nodo-flujo exito">Commit: Parches Mínimos en DOM Real</div>
        </div>
      </div>
    </section>
  );
};

export default FilosofiaSection;

