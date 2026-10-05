import { useState } from 'react';

/**
 * Componente: PanelPedagogico
 * =============================
 * Guía de referencia pedagógica interactiva para la clase.
 * Explica los conceptos teóricos y patrones arquitectónicos del Bloque 3:
 * - Ciclo de vida y efectos secundarios con `useEffect`.
 * - Triplete de estados de asincronía (loading, data, error).
 * - Arquitectura en capas para consumo de APIs REST.
 * - Integración con json-server (GET, POST, PATCH, DELETE).
 * - Prevención de antipatrones en el manejo de efectos.
 */
export function PanelPedagogico() {
  const [abierto, setAbierto] = useState<boolean>(true);

  return (
    <aside className="panel-pedagogico">
      <div className="panel-pedagogico-header" onClick={() => setAbierto(prev => !prev)}>
        <span>💡 <strong>Conceptos Clave del Bloque 3: Ciclo de Vida, Efectos y APIs REST</strong></span>
        <button type="button" className="btn-toggle">
          {abierto ? 'Ocultar guía ▲' : 'Ver guía para alumnos ▼'}
        </button>
      </div>

      {abierto && (
        <div className="panel-pedagogico-contenido">
          {/* Card 1: useEffect & Ciclo de Vida */}
          <div className="concepto-card">
            <span className="concepto-badge uso-useeffect">useEffect & Ciclo de Vida</span>
            <h4>Sincronización Asíncrona</h4>
            <ul>
              <li>
                <strong>Montaje (<code>[]</code>):</strong> Dispara la petición <code>GET /libros</code> tras el primer pintado en pantalla (<em>post-commit</em>), evitando bloquear la UI.
              </li>
              <li>
                <strong>Array de Dependencias:</strong> Controla cuándo se reejecuta el efecto (por ejemplo, ante el disparador de recarga o cambio de cliente HTTP).
              </li>
              <li>
                <strong>Función Asíncrona Interna:</strong> Dado que el callback de <code>useEffect</code> no puede ser <code>async</code> directamente, se define una función interna <code>async function cargarCatalogo()</code>.
              </li>
            </ul>
          </div>

          {/* Card 2: Triplete de Asincronía */}
          <div className="concepto-card">
            <span className="concepto-badge uso-triplete">Triplete de Asincronía</span>
            <h4>Modelado Determinista</h4>
            <ul>
              <li>
                <strong><code>cargando</code> (boolean):</strong> Feedback visual (spinner/esqueleto) para mejorar la experiencia de usuario ante latencia de red.
              </li>
              <li>
                <strong><code>libros</code> (data: T[]):</strong> Estado inmutable con la carga útil recibida tras una respuesta exitosa (código HTTP 2xx).
              </li>
              <li>
                <strong><code>error</code> (string | null):</strong> Captura controlada de interrupciones de red o respuestas de error (4xx/5xx) con opción de reintento.
              </li>
            </ul>
          </div>

          {/* Card 3: Arquitectura en Capas */}
          <div className="concepto-card">
            <span className="concepto-badge uso-arquitectura">Arquitectura Modular</span>
            <h4>Desacoplamiento de Transporte</h4>
            <ul>
              <li>
                <strong><code>clienteHttp.ts</code>:</strong> Instancia Axios centralizada con <code>import.meta.env.VITE_API_URL</code>, timeout e interceptores.
              </li>
              <li>
                <strong><code>libroServicio.ts</code>:</strong> Capa de servicios que expone funciones tipadas (<code>obtenerLibros</code>, <code>crearLibro</code>, etc.).
              </li>
              <li>
                <strong>Componentes limpios:</strong> Los componentes visuales no conocen URLs fijas ni manipulan cabeceras HTTP directamente.
              </li>
            </ul>
          </div>

          {/* Card 4: Operaciones REST con JSON Server */}
          <div className="concepto-card">
            <span className="concepto-badge uso-rest">REST & json-server</span>
            <h4>Operaciones CRUD Reales</h4>
            <ul>
              <li>
                <strong>GET <code>/libros</code>:</strong> Consulta el catálogo completo.
              </li>
              <li>
                <strong>POST <code>/libros</code>:</strong> Da de alta un nuevo libro y genera su <code>id</code> en <code>db.json</code>.
              </li>
              <li>
                <strong>PATCH <code>/libros/:id</code>:</strong> Modifica únicamente la propiedad <code>disponible</code>.
              </li>
              <li>
                <strong>DELETE <code>/libros/:id</code>:</strong> Elimina el registro del backend simulado.
              </li>
            </ul>
          </div>

          {/* Card 5: Antipatrones Evitados */}
          <div className="concepto-card">
            <span className="concepto-badge uso-derivado">Buenas Prácticas</span>
            <h4>Antipatrones Prevenidos</h4>
            <ul>
              <li>
                <strong>Evitar Estado Derivado en Efectos:</strong> El filtro de búsqueda y los totales se calculan directamente en el render, sin <code>useState</code> redundantes.
              </li>
              <li>
                <strong>Reconciliación con Claves:</strong> Cada elemento de la lista utiliza <code>key=&#123;libro.id&#125;</code> estable y única, evitando el antipatrón de <code>key=&#123;index&#125;</code>.
              </li>
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
