import React, { useState } from 'react';
import TarjetaProducto from '../common/TarjetaProducto';

export const SintaxisJsxSection: React.FC = () => {
  // Estado para la demostración interactiva de expresiones {}
  const [nombreUsuario, setNombreUsuario] = useState<string>('Dra. Elena Rossi');
  const [nivelAcceso, setNivelAcceso] = useState<number>(4);

  // Estado para demostración de tipado con TarjetaProducto
  const [precio, setPrecio] = useState<number>(1250.5);
  const [disponible, setDisponible] = useState<boolean>(true);

  return (
    <section className="seccion-bloque" id="jsx">
      <div className="seccion-header">
        <span className="seccion-numero">Tema 1.2</span>
        <h2>Sintaxis JSX y TSX: Reglas, Tipado y Transpilación</h2>
      </div>

      {/* Introducción */}
      <div className="card-conceptual">
        <h3>Naturaleza de JSX (JavaScript XML)</h3>
        <p>
          <strong>JSX</strong> es una extensión de la sintaxis estándar de JavaScript que permite escribir estructuras
          de marcado con aspecto de HTML directamente dentro de archivos de código. No es HTML ni un string:
          es azúcar sintáctico (<em>syntactic sugar</em>) que se compila a invocaciones de funciones JavaScript puras.
        </p>
      </div>

      {/* Las 3 Reglas de JSX */}
      <div className="card-conceptual">
        <h3>Las 3 Reglas Fundamentales de Sintaxis</h3>

        <div className="grid-reglas">
          {/* Regla 1 */}
          <div className="tarjeta-regla">
            <div className="regla-badge">Regla 1</div>
            <h4>Único Nodo Raíz o Fragmentos</h4>
            <p>
              Todo componente debe retornar un único elemento padre contenedor. Si no se desea inyectar nodos adicionales
              al DOM real (evitando alterar layouts de CSS Grid o Flexbox), se utiliza un <strong>Fragmento de React</strong>:
            </p>
            <pre className="codigo-mini">
              <code>{`// ✅ Fragmento abreviado sin nodos extra:
return (
  <>
    <h1>Título Principal</h1>
    <p>Subtítulo descriptivo</p>
  </>
);`}</code>
            </pre>
          </div>

          {/* Regla 2 */}
          <div className="tarjeta-regla">
            <div className="regla-badge">Regla 2</div>
            <h4>Expresiones Dinámicas en Llaves <code>{'{ }'}</code></h4>
            <p>
              Cualquier expresión válida de JavaScript (variables, llamadas a métodos, operadores ternarios o cálculos)
              se evalúa dentro del marcado envolviéndola entre llaves simples <code>{'{ }'}</code>.
            </p>
            <pre className="codigo-mini">
              <code>{`<h2>{nombre.toUpperCase()}</h2>
<p>Nivel: {nivel * 2}</p>
<span>{activo ? "Online" : "Offline"}</span>`}</code>
            </pre>
          </div>

          {/* Regla 3 */}
          <div className="tarjeta-regla">
            <div className="regla-badge">Regla 3</div>
            <h4>Atributos en Convención camelCase</h4>
            <p>
              Dado que JSX compila a objetos JavaScript y este posee palabras reservadas, los atributos HTML
              se escriben en <em>camelCase</em>:
            </p>
            <ul className="lista-atributos">
              <li><code>class</code> &rarr; <code>className</code></li>
              <li><code>for</code> &rarr; <code>htmlFor</code></li>
              <li><code>tabindex</code> &rarr; <code>tabIndex</code></li>
              <li><code>onclick</code> &rarr; <code>onClick</code></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Demostración Interactiva de Expresiones {} */}
      <div className="card-conceptual">
        <h3>Demostración Práctica: Evaluación de Expresiones Dinámicas</h3>
        <p className="subtexto">
          Edite los datos de entrada para observar cómo las expresiones en TSX recalculan la vista en tiempo real:
        </p>

        <div className="demo-expresiones-grid">
          <div className="formulario-control">
            <div className="campo-form">
              <label htmlFor="input-nombre">Nombre de Usuario:</label>
              <input
                id="input-nombre"
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </div>
            <div className="campo-form">
              <label htmlFor="input-nivel">Nivel de Acceso (1 a 5):</label>
              <input
                id="input-nivel"
                type="number"
                min={1}
                max={5}
                value={nivelAcceso}
                onChange={(e) => setNivelAcceso(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="tarjeta-perfil-preview">
            <span className="preview-label">Renderizado del Componente TSX:</span>
            <div className="tarjeta-perfil">
              <h4>{nombreUsuario.trim() ? nombreUsuario.toUpperCase() : '(SIN NOMBRE)'}</h4>
              <p>Nivel de Autorización Calculado: <strong>{nivelAcceso * 2}</strong></p>
              <p>
                Rol Asignado:{' '}
                <span className={`badge-rol ${nivelAcceso >= 3 ? 'admin' : 'operador'}`}>
                  {nivelAcceso >= 3 ? 'Administrador' : 'Operador'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tipado Estático con TSX */}
      <div className="card-conceptual">
        <h3>Tipado Estático con TSX e Interfaces</h3>
        <p>
          En este proyecto y a lo largo de la cátedra se utiliza <strong>TSX</strong>. TypeScript valida el contrato de entrada
          de los componentes en tiempo de compilación, impidiendo errores de tipos antes de que el código llegue al navegador.
        </p>

        <div className="demo-producto-grid">
          <div className="bloque-codigo">
            <div className="codigo-cabecera">
              <span>Contrato de Entrada (TSX)</span>
            </div>
            <pre>
              <code>{`interface TarjetaProductoProps {
  id: number;
  titulo: string;
  precio: number;
  disponible?: boolean; // Propiedad opcional
}

function TarjetaProducto({ 
  id, 
  titulo, 
  precio, 
  disponible = true 
}: TarjetaProductoProps) { ... }`}</code>
            </pre>
          </div>

          <div className="producto-interactivo">
            <div className="controles-producto">
              <label>
                Precio ($):
                <input
                  type="number"
                  step="50"
                  value={precio}
                  onChange={(e) => setPrecio(Number(e.target.value))}
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={disponible}
                  onChange={(e) => setDisponible(e.target.checked)}
                />
                En Stock (disponible)
              </label>
            </div>

            <TarjetaProducto
              id={101}
              titulo="Monitor Gamer IPS 27''"
              precio={precio}
              disponible={disponible}
            />
          </div>
        </div>
      </div>

      {/* Proceso de Transpilación */}
      <div className="card-conceptual">
        <h3>Proceso de Transpilación: De TSX a JavaScript Nativo</h3>
        <p>
          El navegador no comprende JSX ni TypeScript nativamente. Herramientas como <strong>Vite y SWC</strong>
          remueven los tipos y transforman cada etiqueta JSX en invocaciones de la función <code>_jsx</code> del runtime:
        </p>

        <div className="comparativa-codigo-grid">
          <div className="bloque-codigo">
            <div className="codigo-cabecera">
              <span>Código Fuente (.tsx)</span>
            </div>
            <pre>
              <code>{`const elemento = (
  <h1 className="titulo-destacado">
    Sistema de Gestión
  </h1>
);`}</code>
            </pre>
          </div>

          <div className="bloque-codigo">
            <div className="codigo-cabecera">
              <span>Resultado Transpilado (JS Ejecutable)</span>
            </div>
            <pre>
              <code>{`import { jsx as _jsx } from 'react/jsx-runtime';

const elemento = _jsx("h1", {
  className: "titulo-destacado",
  children: "Sistema de Gestión"
});`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SintaxisJsxSection;

