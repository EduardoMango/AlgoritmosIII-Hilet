import { useState } from 'react';

/**
 * Componente PanelPedagogico
 * ==========================
 * Guía de referencia visual para los alumnos durante la clase.
 * Explica en vivo qué Hooks están interviniendo en la pantalla.
 */
export function PanelPedagogico() {
  const [abierto, setAbierto] = useState<boolean>(true);

  return (
    <div className="panel-pedagogico">
      <div className="panel-pedagogico-header" onClick={() => setAbierto(prev => !prev)}>
        <span>💡 <strong>Conceptos Clave del Bloque 2 en esta Demostración</strong></span>
        <button type="button" className="btn-toggle">
          {abierto ? 'Ocultar guía ▲' : 'Ver guía para alumnos ▼'}
        </button>
      </div>

      {abierto && (
        <div className="panel-pedagogico-contenido">
          <div className="concepto-card">
            <span className="concepto-badge uso-usestate">useState</span>
            <h4>Memoria e Inmutabilidad</h4>
            <ul>
              <li>
                <strong>Persistencia reactiva:</strong> Guarda <code>libros</code> y <code>cargando</code> entre renders.
              </li>
              <li>
                <strong>Inmutabilidad:</strong> Al agregar usamos <code>[...prev, nuevo]</code> y al eliminar <code>prev.filter()</code>. Nunca <code>push()</code> ni <code>splice()</code>.
              </li>
              <li>
                <strong>Formularios controlados:</strong> <code>value</code> y <code>onChange</code> hacen de React la única fuente de verdad.
              </li>
            </ul>
          </div>

          <div className="concepto-card">
            <span className="concepto-badge uso-useeffect">useEffect</span>
            <h4>Efectos Secundarios y Ciclo de Vida</h4>
            <ul>
              <li>
                <strong>Montaje (<code>[]</code>):</strong> Carga inicial de datos con un retardo simulado para ver el estado de carga.
              </li>
              <li>
                <strong>Dependencias (<code>[libros]</code>):</strong> Se dispara cada vez que el arreglo de libros cambia, sincronizando el título de la pestaña y el <code>localStorage</code>.
              </li>
              <li>
                <strong>Sincronización:</strong> Permite conectar el mundo reactivo de React con APIs o sistemas externos del navegador.
              </li>
            </ul>
          </div>

          <div className="concepto-card">
            <span className="concepto-badge uso-derivado">Cálculo Derivado</span>
            <h4>Evitar Estado Redundante</h4>
            <ul>
              <li>
                <strong>Filtro de búsqueda:</strong> El listado filtrado se calcula con <code>libros.filter(...)</code> al vuelo en cada render.
              </li>
              <li>
                <strong>Totales y estadísticas:</strong> El contador de libros disponibles no se almacena en otro <code>useState</code>, evitando desincronizaciones.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
