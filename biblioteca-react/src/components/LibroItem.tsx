import { useState } from 'react';
import type { Libro } from '../types/libro';

interface LibroItemProps {
  libro: Libro;
  onToggleDisponibilidad: (id: number | string, nuevoEstado: boolean) => Promise<void> | void;
  onEliminar: (id: number | string) => Promise<void> | void;
}

/**
 * Componente: LibroItem
 * ======================
 * Representa una tarjeta de libro individual en la lista.
 * Muestra las acciones CRUD (PATCH para cambiar estado, DELETE para eliminar)
 * con retroalimentación visual de estado ocupado durante las peticiones asíncronas.
 */
export function LibroItem({ libro, onToggleDisponibilidad, onEliminar }: LibroItemProps) {
  const [procesando, setProcesando] = useState<boolean>(false);

  async function handleToggle() {
    try {
      setProcesando(true);
      await onToggleDisponibilidad(libro.id, !libro.disponible);
    } finally {
      setProcesando(false);
    }
  }

  async function handleEliminar() {
    const confirmacion = window.confirm(`¿Seguro que deseas eliminar "${libro.titulo}" de la base de datos?`);
    if (!confirmacion) return;

    try {
      setProcesando(true);
      await onEliminar(libro.id);
    } finally {
      setProcesando(false);
    }
  }

  return (
    <article className={`libro-item ${libro.disponible ? 'disponible' : 'prestado'} ${procesando ? 'en-transito' : ''}`}>
      <div className="libro-info">
        <div className="libro-header-row">
          <span className="libro-genero">{libro.genero}</span>
          <span className={`badge ${libro.disponible ? 'badge-success' : 'badge-warning'}`}>
            {libro.disponible ? '✓ Disponible' : '⌛ Prestado'}
          </span>
        </div>
        <h4 className="libro-titulo">{libro.titulo}</h4>
        <p className="libro-autor">Por <strong>{libro.autor}</strong></p>
        <span className="libro-id-tag">ID: <code>{libro.id}</code></span>
      </div>

      <div className="libro-acciones">
        {/* Botón de alternar préstamo (HTTP PATCH) */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={procesando}
          className={`btn btn-sm ${libro.disponible ? 'btn-outline-warning' : 'btn-outline-success'}`}
          title={libro.disponible ? 'Registrar préstamo (PATCH /libros/:id)' : 'Registrar devolución (PATCH /libros/:id)'}
        >
          {procesando ? 'Enviando...' : libro.disponible ? 'Prestar' : 'Devolver'}
        </button>

        {/* Botón de eliminar (HTTP DELETE) */}
        <button
          type="button"
          onClick={handleEliminar}
          disabled={procesando}
          className="btn btn-sm btn-outline-danger"
          title="Eliminar de la API (DELETE /libros/:id)"
        >
          {procesando ? 'Borrando...' : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}
