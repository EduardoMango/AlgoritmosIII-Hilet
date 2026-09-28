import React, { useState } from 'react';
import type { ComparativaItem } from '../../types';

const DATOS_COMPARATIVOS: ComparativaItem[] = [
  {
    atributo: 'Manipulación Visual',
    enfoqueImperativo: 'Directa sobre los nodos del DOM real (appendChild, innerHTML, textContent).',
    enfoqueDeclarativo: 'Mediante la abstracción del Virtual DOM y reconciliación automática (Diffing O(n)).',
    explicacion: 'En Vanilla JS cada cambio fuerza al navegador a recalcular estilos y geometrías. En React, el VDOM agrupa los cambios y aplica solo los parches mínimos necesarios.',
  },
  {
    atributo: 'Flujo de Datos',
    enfoqueImperativo: 'Bidireccional o disperso sin restricciones explícitas; múltiples funciones compiten por mutar los mismos nodos.',
    enfoqueDeclarativo: 'Estrictamente Unidireccional (Top-Down) de componentes padres a componentes hijos.',
    explicacion: 'El flujo unidireccional garantiza predictibilidad: el estado reside en un único lugar y baja como props inmutables.',
  },
  {
    atributo: 'Gestión de Cambios',
    enfoqueImperativo: 'Pasos explícitos para actualizar cada nodo ante eventos (addEventListener manuales).',
    enfoqueDeclarativo: 'Redescripción de la interfaz en función de cambios en el estado (UI = f(State)).',
    explicacion: 'Al cambiar el estado con una función actualizadora, React reejecuta el componente y sincroniza la vista automáticamente.',
  },
  {
    atributo: 'Sintaxis de Interfaz',
    enfoqueImperativo: 'Separación física en archivos .html y scripts .js independientes.',
    enfoqueDeclarativo: 'Integración mediante JSX / TSX en componentes funcionales autónomos y reutilizables.',
    explicacion: 'JSX une la estructura visual con la lógica de renderizado en una única unidad de cohesión alta y bajo acoplamiento.',
  },
  {
    atributo: 'Inmutabilidad y Tipado',
    enfoqueImperativo: 'Opcional y sin validación en tiempo de compilación; propensa a errores en tiempo de ejecución.',
    enfoqueDeclarativo: 'Inmutabilidad obligatoria de props y validación estática de tipos con interfaces de TypeScript.',
    explicacion: 'TypeScript impide el paso de datos erróneos o la omisión de props obligatorias antes de que el código llegue a producción.',
  },
];

export const ComparativaSection: React.FC = () => {
  const [filtro, setFiltro] = useState<string>('');

  const datosFiltrados = DATOS_COMPARATIVOS.filter(
    (item) =>
      item.atributo.toLowerCase().includes(filtro.toLowerCase()) ||
      item.enfoqueImperativo.toLowerCase().includes(filtro.toLowerCase()) ||
      item.enfoqueDeclarativo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <section className="seccion-bloque" id="comparativa">
      <div className="seccion-header">
        <span className="seccion-numero">Tema 1.5</span>
        <h2>Resumen Comparativo de Conceptos de Ingeniería</h2>
      </div>

      <div className="card-conceptual">
        <p>
          La siguiente matriz resume las diferencias arquitectónicas y operativas entre el enfoque tradicional
          de manipulación de interfaces con JavaScript Vanilla y el paradigma moderno de React con TypeScript:
        </p>

        <div className="filtro-tabla-box">
          <label htmlFor="input-filtro">Filtrar atributos o conceptos:</label>
          <input
            id="input-filtro"
            type="text"
            placeholder="Buscar por atributo (ej. flujo, dom, estado, tipos)..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="tabla-responsive-wrapper">
          <table className="tabla-comparativa">
            <thead>
              <tr>
                <th>Atributo de Ingeniería</th>
                <th>Enfoque Imperativo (Vanilla JS)</th>
                <th>Enfoque Declarativo (React + TSX)</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((item) => (
                <tr key={item.atributo}>
                  <td className="celda-atributo">
                    <strong>{item.atributo}</strong>
                    <span className="detalle-atributo">{item.explicacion}</span>
                  </td>
                  <td className="celda-imperativo">{item.enfoqueImperativo}</td>
                  <td className="celda-declarativo">{item.enfoqueDeclarativo}</td>
                </tr>
              ))}
              {datosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={3} className="sin-resultados">
                    No se encontraron atributos coincidentes con el filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparativaSection;

