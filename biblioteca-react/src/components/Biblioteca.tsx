import { useState, useEffect, type ChangeEvent } from 'react';
import type { Libro } from '../types/libro';
import { LIBROS_INICIALES } from '../data/librosIniciales';
import { LibroForm } from './LibroForm';
import { LibroItem } from './LibroItem';
import { PanelPedagogico } from './PanelPedagogico';

/**
 * Componente: Biblioteca
 * ======================
 * Vista principal interactiva para la gestión de la biblioteca.
 * Centraliza la demostración de los conceptos del Bloque 2:
 * 1. useState: Gestión del estado de la colección, carga y filtros.
 * 2. useEffect: Ciclo de vida (carga asíncrona al montaje y sincronización reactiva).
 * 3. Inmutabilidad: Modificación pura de arreglos (spread, map, filter).
 * 4. Estado Derivado: Métricas y búsquedas calculadas al vuelo.
 */
export function Biblioteca() {
  // =========================================================================
  // 1. GESTIÓN DE ESTADO CON useState
  // =========================================================================

  // Estado para la colección de libros en memoria
  const [libros, setLibros] = useState<Libro[]>([]);

  // Estado booleano para representar la carga asincrónica
  const [cargando, setCargando] = useState<boolean>(true);

  // Estado para el campo de búsqueda de texto (Componente controlado)
  const [busqueda, setBusqueda] = useState<string>('');

  // Estado para el filtro de disponibilidad
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<'todos' | 'disponibles' | 'prestados'>('todos');

  // Estado auxiliar para mostrar el momento de sincronización generado por useEffect
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState<string>('');

  // =========================================================================
  // 2. EFECTOS SECUNDARIOS CON useEffect
  // =========================================================================

  /**
   * EFECTO 1: Montaje del Componente (Array de dependencias vacío [])
   * -----------------------------------------------------------------
   * Se ejecuta estrictamente UNA VEZ cuando el componente aparece en el DOM.
   * Simula una llamada de red asíncrona a un backend para traer el catálogo.
   */
  useEffect(() => {
    const guardados = localStorage.getItem('hilet_libros');

    const temporizador = setTimeout(() => {
      if (guardados) {
        try {
          setLibros(JSON.parse(guardados) as Libro[]);
        } catch {
          setLibros(LIBROS_INICIALES);
        }
      } else {
        setLibros(LIBROS_INICIALES);
      }
      setCargando(false);
    }, 900); // Retardo simulado para visibilizar el estado "cargando"

    return () => clearTimeout(temporizador);
  }, []);

  /**
   * EFECTO 2: Sincronización Reactiva (Array de dependencias [libros, cargando])
   * ----------------------------------------------------------------------------
   * Se ejecuta automáticamente CADA VEZ que el estado 'libros' es modificado.
   * Aplica efectos secundarios en sistemas externos:
   * 1. Actualiza el título de la pestaña del navegador (document.title).
   * 2. Persiste la lista actualizada en localStorage.
   * 3. Registra la marca temporal de sincronización.
   */
  useEffect(() => {
    if (!cargando) {
      document.title = `📚 Biblioteca (${libros.length} libros)`;
      localStorage.setItem('hilet_libros', JSON.stringify(libros));
      const ahora = new Date().toLocaleTimeString();
      setUltimaSincronizacion(ahora);
    }
  }, [libros, cargando]);

  // =========================================================================
  // 3. MUTACIONES INMUTABLES DEL ESTADO
  // =========================================================================

  function handleAgregarLibro(nuevoLibro: Libro): void {
    setLibros((librosPrevios: Libro[]): Libro[] => [nuevoLibro, ...librosPrevios]);
  }

  function handleToggleDisponibilidad(id: number): void {
    setLibros((librosPrevios: Libro[]): Libro[] =>
      librosPrevios.map((libro: Libro): Libro =>
        libro.id === id ? { ...libro, disponible: !libro.disponible } : libro
      )
    );
  }

  function handleEliminarLibro(id: number): void {
    setLibros((librosPrevios: Libro[]): Libro[] =>
      librosPrevios.filter((libro: Libro): boolean => libro.id !== id)
    );
  }

  function handleRestablecer(): void {
    setCargando(true);
    setTimeout(() => {
      setLibros(LIBROS_INICIALES);
      localStorage.removeItem('hilet_libros');
      setCargando(false);
    }, 500);
  }

  // =========================================================================
  // 4. ESTADO DERIVADO (Cálculos puros sin useState redundantes)
  // =========================================================================

  const librosFiltrados: Libro[] = libros.filter((libro: Libro): boolean => {
    const coincideTexto =
      libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.genero.toLowerCase().includes(busqueda.toLowerCase());

    if (!coincideTexto) return false;

    if (filtroDisponibilidad === 'disponibles') return libro.disponible;
    if (filtroDisponibilidad === 'prestados') return !libro.disponible;
    return true;
  });

  const totalLibros: number = libros.length;
  const totalDisponibles: number = libros.filter((l: Libro) => l.disponible).length;
  const totalPrestados: number = totalLibros - totalDisponibles;

  // =========================================================================
  // 5. RENDERIZADO DE LA INTERFAZ
  // =========================================================================

  return (
    <div className="app-container">
      {/* Encabezado Principal */}
      <header className="app-header">
        <div className="header-badge">Algoritmos III - Instituto Hilet</div>
        <h1>📖 Sistema de Biblioteca: Demostración de Estado</h1>
        <p className="header-desc">
          Showcase introductorio de <code>useState</code> y <code>useEffect</code> según los contenidos del <strong>Bloque 2</strong>.
        </p>
      </header>

      {/* Guía Pedagógica Interactiva para Alumnos */}
      <PanelPedagogico />

      {/* Estado de Sincronización en Vivo */}
      {ultimaSincronizacion && (
        <div className="barra-sincronizacion">
          <span>
            🔄 <strong>useEffect activo:</strong> Estado sincronizado con <code>localStorage</code> y <code>document.title</code> a las <strong>{ultimaSincronizacion}</strong>.
          </span>
          <button type="button" onClick={handleRestablecer} className="btn btn-link">
            Restablecer catálogo inicial
          </button>
        </div>
      )}

      {/* Métricas y Estado Derivado */}
      <section className="metricas-grid">
        <div className="metrica-card">
          <span className="metrica-numero">{totalLibros}</span>
          <span className="metrica-label">Total de Libros</span>
        </div>
        <div className="metrica-card disponible">
          <span className="metrica-numero">{totalDisponibles}</span>
          <span className="metrica-label">Disponibles</span>
        </div>
        <div className="metrica-card prestado">
          <span className="metrica-numero">{totalPrestados}</span>
          <span className="metrica-label">Prestados</span>
        </div>
      </section>

      {/* Formulario de Alta con Componente Controlado */}
      <section className="seccion-formulario">
        <LibroForm onAgregarLibro={handleAgregarLibro} />
      </section>

      {/* Barra de Filtros y Búsqueda */}
      <section className="card card-filtros">
        <div className="filtros-header">
          <h3>🔍 Explorador de Catálogo</h3>
          <span className="resultados-tag">
            Mostrando {librosFiltrados.length} de {totalLibros} libros
          </span>
        </div>

        <div className="filtros-grid">
          {/* Input Controlado de Búsqueda */}
          <div className="form-group flex-1">
            <label htmlFor="busqueda">Buscar por Título, Autor o Género:</label>
            <input
              id="busqueda"
              type="text"
              placeholder="Escribe para filtrar en tiempo real..."
              value={busqueda}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Selector de Filtro de Disponibilidad */}
          <div className="form-group">
            <label htmlFor="filtro-disp">Filtrar por Disponibilidad:</label>
            <select
              id="filtro-disp"
              value={filtroDisponibilidad}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFiltroDisponibilidad(e.target.value as 'todos' | 'disponibles' | 'prestados')
              }
            >
              <option value="todos">Todos los libros</option>
              <option value="disponibles">Solo Disponibles</option>
              <option value="prestados">Solo Prestados</option>
            </select>
          </div>
        </div>
      </section>

      {/* Listado de Libros con Efecto de Carga */}
      <section className="seccion-listado">
        {cargando ? (
          <div className="card estado-carga">
            <div className="spinner"></div>
            <h3>Cargando catálogo de la biblioteca...</h3>
            <p>
              Demostración de <code>useEffect(() =&gt; &#123; ... &#125;, [])</code>:
              simulando latencia de conexión con una API.
            </p>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="card estado-vacio">
            <p>📭 No se encontraron libros que coincidan con la búsqueda.</p>
            {busqueda && (
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => setBusqueda('')}
              >
                Limpiar filtro de búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="libros-grid">
            {librosFiltrados.map((libro: Libro) => (
              <LibroItem
                key={libro.id}
                libro={libro}
                onToggleDisponibilidad={handleToggleDisponibilidad}
                onEliminar={handleEliminarLibro}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
