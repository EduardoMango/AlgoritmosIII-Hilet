import { useState, useEffect, type ChangeEvent } from 'react';
import axios from 'axios';
import type { Libro, NuevoLibroDto, FiltroDisponibilidad } from '../types/libro';
import * as libroServicio from '../servicios/libroServicio';
import { LibroForm } from './LibroForm';
import { LibroItem } from './LibroItem';
import { PanelPedagogico } from './PanelPedagogico';

/**
 * Componente: Biblioteca
 * ======================
 * Vista principal refactorizada según los contenidos del Bloque 3:
 * 1. useEffect: Ciclo de vida y peticiones de red asíncronas con AbortController y cleanup.
 * 2. Triplete de Estados de Asincronía: `cargando` (loading), `libros` (data) y `error`.
 * 3. Integración con REST API: Consumo de endpoints JSON Server (GET, POST, PATCH, DELETE).
 * 4. Arquitectura desacoplada: Uso de `clienteHttp` (Axios) y `libroServicio`.
 * 5. Comparativa didáctica: Permite alternar entre el cliente `axios` y el cliente nativo `fetch`.
 * 6. Estado Derivado: Filtrado y métricas calculadas en el render sin efectos redundantes.
 */
export function Biblioteca() {
  // =========================================================================
  // 1. PATRÓN DEL TRIPLETE DE ESTADOS DE ASINCRONÍA + ESTADOS LOCALES
  // =========================================================================

  // Estado de Datos (data)
  const [libros, setLibros] = useState<Libro[]>([]);

  // Estado de Carga (loading)
  const [cargando, setCargando] = useState<boolean>(true);

  // Estado de Error (error)
  const [error, setError] = useState<string | null>(null);

  // Estados de control de la UI (Filtros y Búsqueda)
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<FiltroDisponibilidad>('todos');

  // Disparador reactivo para forzar recargas manuales (Reintentos)
  const [recargarTrigger, setRecargarTrigger] = useState<number>(0);

  // Selector didáctico para comparar axios vs fetch en vivo durante la clase
  const [clienteSeleccionado, setClienteSeleccionado] = useState<'axios' | 'fetch'>('axios');

  // Marca temporal para observar la ejecución de sincronizaciones en vivo
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState<string>('');

  // =========================================================================
  // 2. EFECTOS SECUNDARIOS CON useEffect
  // =========================================================================

  /**
   * EFECTO 1: Consumo de la API REST al Montaje y Sincronización Paramétrica
   * ------------------------------------------------------------------------
   * - Array de dependencias: [recargarTrigger, clienteSeleccionado]
   * - Patrón didáctico estándar de petición asíncrona dentro de useEffect (Sección 3.2).
   */
  useEffect(() => {
    async function cargarCatalogo() {
      try {
        setCargando(true);
        setError(null);

        // Invocación a la capa de servicios desacoplada
        const datos = clienteSeleccionado === 'axios'
          ? await libroServicio.obtenerLibros()
          : await libroServicio.obtenerLibrosConFetch();

        setLibros(datos);
        const horaActual = new Date().toLocaleTimeString();
        setUltimaSincronizacion(horaActual);
      } catch (errorCapturado: unknown) {
        console.error('[Error de API]', errorCapturado);

        if (axios.isAxiosError(errorCapturado)) {
          if (errorCapturado.code === 'ERR_NETWORK') {
            const urlBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            setError(`No fue posible conectar con JSON Server en ${urlBase}. Verifique que el servicio esté corriendo (npm run server).`);
          } else {
            setError(`Error del servidor HTTP (${errorCapturado.response?.status || 'desconocido'}): ${errorCapturado.message}`);
          }
        } else if (errorCapturado instanceof Error) {
          setError(errorCapturado.message);
        } else {
          setError('Ocurrió un error inesperado al consultar la API.');
        }
      } finally {
        setCargando(false);
      }
    }

    cargarCatalogo();
  }, [recargarTrigger, clienteSeleccionado]);

  /**
   * EFECTO 2: Sincronización con el Sistema Exterior (document.title)
   * ----------------------------------------------------------------
   * Demuestra sincronización reactiva legítima con una API externa (el DOM del navegador).
   */
  useEffect(() => {
    if (!cargando && error === null) {
      document.title = `📚 Biblioteca (${libros.length} libros) - Bloque 3`;
    }
  }, [libros.length, cargando, error]);

  // =========================================================================
  // 3. OPERACIONES CRUD CON LA API REST (JSON Server)
  // =========================================================================

  /**
   * Alta de libro: Envía HTTP POST a la API y actualiza el estado inmutablemente
   */
  async function handleAgregarLibro(nuevoLibro: NuevoLibroDto): Promise<void> {
    try {
      const libroCreado = await libroServicio.crearLibro(nuevoLibro);
      // Actualización funcional inmutable sin necesidad de recargar toda la base
      setLibros((prev: Libro[]) => [libroCreado, ...prev]);
    } catch (err: unknown) {
      alert('Error al registrar el libro en la API: ' + (err instanceof Error ? err.message : String(err)));
      throw err;
    }
  }

  /**
   * Modificación parcial: Envía HTTP PATCH /libros/:id alternando disponibilidad
   */
  async function handleToggleDisponibilidad(id: number | string, nuevoEstado: boolean): Promise<void> {
    try {
      const libroActualizado = await libroServicio.cambiarDisponibilidadLibro(id, nuevoEstado);
      setLibros((prev: Libro[]) =>
        prev.map((item: Libro) => (item.id === id ? libroActualizado : item))
      );
    } catch (err: unknown) {
      alert('No se pudo actualizar el estado en el servidor: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  /**
   * Baja de libro: Envía HTTP DELETE /libros/:id a la API
   */
  async function handleEliminarLibro(id: number | string): Promise<void> {
    try {
      await libroServicio.eliminarLibro(id);
      setLibros((prev: Libro[]) => prev.filter((item: Libro) => item.id !== id));
    } catch (err: unknown) {
      alert('No se pudo eliminar el registro en la API: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  function handleReintentarConexion(): void {
    setRecargarTrigger((prev) => prev + 1);
  }

  // =========================================================================
  // 4. ESTADO DERIVADO (Evitando el Antipatrón 1 de useEffect)
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
  // 5. RENDERIZADO VISUAL
  // =========================================================================

  return (
    <div className="app-container">
      {/* Encabezado Principal */}
      <header className="app-header">
        <div className="header-badge">Algoritmos III - Instituto Hilet</div>
        <h1>📖 Sistema de Biblioteca: Consumo de APIs y useEffect</h1>
        <p className="header-desc">
          Demostración integral de <strong>Ciclo de Vida</strong>, <strong>Triplete de Asincronía</strong> y <strong>JSON Server</strong> según los contenidos del <strong>Bloque 3</strong>.
        </p>
      </header>

      {/* Guía Pedagógica Interactiva para Alumnos */}
      <PanelPedagogico />

      {/* Barra de Control de API y Sincronización */}
      <div className="barra-sincronizacion">
        <div className="barra-info">
          <span>
            🌐 <strong>Endpoint REST:</strong> <code>{import.meta.env.VITE_API_URL || 'http://localhost:3001'}/libros</code>
          </span>
          {ultimaSincronizacion && (
            <span className="timestamp-badge">
              ⏱ Última respuesta exitosa: <strong>{ultimaSincronizacion}</strong>
            </span>
          )}
        </div>

        <div className="barra-acciones">
          {/* Selector de Cliente HTTP para Demostración */}
          <div className="selector-cliente">
            <label htmlFor="cliente-http">Cliente HTTP:</label>
            <select
              id="cliente-http"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value as 'axios' | 'fetch')}
              className="select-cliente"
            >
              <option value="axios">Axios (con Interceptores y Timeout)</option>
              <option value="fetch">Fetch Nativo (con AbortSignal)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleReintentarConexion}
            disabled={cargando}
            className="btn btn-sm btn-outline-primary"
            title="Reejecuta el efecto useEffect para recargar datos desde el servidor"
          >
            {cargando ? 'Sincronizando...' : '🔄 Recargar Catálogo'}
          </button>
        </div>
      </div>

      {/* Métricas y Estado Derivado */}
      <section className="metricas-grid">
        <div className="metrica-card">
          <span className="metrica-numero">{totalLibros}</span>
          <span className="metrica-label">Total en Base de Datos</span>
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

      {/* Formulario de Alta con Petición HTTP POST */}
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
              placeholder="Filtrar en tiempo real (cálculo en render)..."
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
                setFiltroDisponibilidad(e.target.value as FiltroDisponibilidad)
              }
            >
              <option value="todos">Todos los libros</option>
              <option value="disponibles">Solo Disponibles</option>
              <option value="prestados">Solo Prestados</option>
            </select>
          </div>
        </div>
      </section>

      {/* Listado de Libros con el Triplete de Asincronía */}
      <section className="seccion-listado">
        {/* FASE 1: ESTADO DE CARGA (loading) */}
        {cargando ? (
          <div className="card estado-carga" role="status" aria-live="polite">
            <div className="spinner"></div>
            <h3>Consultando la API REST de Libros...</h3>
            <p>
              Demostración de <code>useEffect(() =&gt; &#123; ... &#125;, [])</code> con cliente <strong>{clienteSeleccionado}</strong>.
            </p>
          </div>
        ) : error !== null ? (
          /* FASE 2: ESTADO DE ERROR (error) */
          <div className="card estado-error" role="alert">
            <div className="icono-error">⚠️</div>
            <h3>Fallo de Comunicación con el Servidor</h3>
            <p className="mensaje-error">{error}</p>
            <div className="guia-solucion">
              <p><strong>💡 Para iniciar JSON Server en otra terminal ejecuta:</strong></p>
              <pre><code>npm run server</code></pre>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleReintentarConexion}
            >
              Reintentar Conexión
            </button>
          </div>
        ) : librosFiltrados.length === 0 ? (
          /* FASE 3A: ESTADO VACÍO */
          <div className="card estado-vacio">
            <p>📭 No se encontraron libros registrados en la base de datos o coincidentes con el filtro.</p>
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
          /* FASE 3B: ESTADO DE DATOS EXITOSO (data) */
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
