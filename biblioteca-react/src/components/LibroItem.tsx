import type { Libro } from '../types/libro';

interface LibroItemProps {
  libro: Libro;
  onToggleDisponibilidad: (id: number) => void;
  onEliminar: (id: number) => void;
}

/**
 * Componente LibroItem
 * ====================
 * Representa una tarjeta de libro individual en la lista.
 * Muestra acciones que desencadenan actualizaciones inmutables en el componente padre.
 */
export function LibroItem({ libro, onToggleDisponibilidad, onEliminar }: LibroItemProps) {
  return (
    <div className={`libro-item ${libro.disponible ? 'disponible' : 'prestado'}`}>
      <div className="libro-info">
        <div className="libro-header-row">
          <span className="libro-genero">{libro.genero}</span>
          <span className={`badge ${libro.disponible ? 'badge-success' : 'badge-warning'}`}>
            {libro.disponible ? '✓ Disponible' : '⌛ Prestado'}
          </span>
        </div>
        <h4 className="libro-titulo">{libro.titulo}</h4>
        <p className="libro-autor">Por <strong>{libro.autor}</strong></p>
      </div>

      <div className="libro-acciones">
        {/* Alternar estado de préstamo/disponibilidad */}
        <button
          type="button"
          onClick={() => onToggleDisponibilidad(libro.id)}
          className={`btn btn-sm ${libro.disponible ? 'btn-outline-warning' : 'btn-outline-success'}`}
          title={libro.disponible ? 'Registrar préstamo' : 'Registrar devolución'}
        >
          {libro.disponible ? 'Prestar' : 'Devolver'}
        </button>

        {/* Eliminar libro */}
        <button
          type="button"
          onClick={() => onEliminar(libro.id)}
          className="btn btn-sm btn-outline-danger"
          title="Eliminar de la biblioteca"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
