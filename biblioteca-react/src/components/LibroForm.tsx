import { useState, type SubmitEvent, type ChangeEvent } from 'react';
import type { NuevoLibroDto } from '../types/libro';

interface LibroFormProps {
  /** Función callback que despacha la petición POST /libros al backend */
  onAgregarLibro: (nuevoLibro: NuevoLibroDto) => Promise<boolean | void>;
}

/**
 * Componente: LibroForm
 * =====================
 * Demuestra el patrón de COMPONENTE CONTROLADO integrado con llamadas asíncronas HTTP POST:
 * 1. Mantiene el estado local de los inputs sincronizado con la memoria de React.
 * 2. Bloquea el botón de envío y previene doble sumisión mientras la petición está en tránsito.
 * 3. Procesa respuestas exitosas limpiando el formulario, o muestra feedback en caso de error.
 */
export function LibroForm({ onAgregarLibro }: LibroFormProps) {
  const [titulo, setTitulo] = useState<string>('');
  const [autor, setAutor] = useState<string>('');
  const [genero, setGenero] = useState<string>('Programación');
  const [errorLocal, setErrorLocal] = useState<string>('');
  const [enviando, setEnviando] = useState<boolean>(false);

  async function manejarSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!titulo.trim() || !autor.trim()) {
      setErrorLocal('El título y el autor son campos obligatorios.');
      return;
    }

    try {
      setEnviando(true);
      setErrorLocal('');

      const nuevoLibro: NuevoLibroDto = {
        titulo: titulo.trim(),
        autor: autor.trim(),
        genero,
        disponible: true,
      };

      await onAgregarLibro(nuevoLibro);

      // Limpieza de campos al completar exitosamente el POST
      setTitulo('');
      setAutor('');
      setGenero('Programación');
    } catch (err: unknown) {
      setErrorLocal(err instanceof Error ? err.message : 'Error al guardar el libro en el servidor.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="card form-libro" onSubmit={manejarSubmit}>
      <div className="card-header">
        <h3>➕ Agregar Libro (Petición HTTP POST /libros)</h3>
        <p className="card-subtitle">
          Envía los datos a JSON Server mediante <code>axios.post()</code> encapsulado en <code>libroServicio</code>.
        </p>
      </div>

      {errorLocal && <div className="alerta-error">{errorLocal}</div>}

      <div className="form-grid">
        {/* Campo Título */}
        <div className="form-group">
          <label htmlFor="titulo">Título del Libro:</label>
          <input
            id="titulo"
            type="text"
            placeholder="Ej: Código Limpio"
            value={titulo}
            disabled={enviando}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTitulo(e.target.value);
              if (errorLocal) setErrorLocal('');
            }}
          />
        </div>

        {/* Campo Autor */}
        <div className="form-group">
          <label htmlFor="autor">Autor:</label>
          <input
            id="autor"
            type="text"
            placeholder="Ej: Robert C. Martin"
            value={autor}
            disabled={enviando}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setAutor(e.target.value);
              if (errorLocal) setErrorLocal('');
            }}
          />
        </div>

        {/* Selector de Género */}
        <div className="form-group">
          <label htmlFor="genero">Categoría / Género:</label>
          <select
            id="genero"
            value={genero}
            disabled={enviando}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenero(e.target.value)}
          >
            <option value="Programación">Programación</option>
            <option value="Ingeniería de Software">Ingeniería de Software</option>
            <option value="Arquitectura de Software">Arquitectura de Software</option>
            <option value="Novela / Realismo Mágico">Novela / Realismo Mágico</option>
            <option value="Novela / Ficción">Novela / Ficción</option>
            <option value="Ficción / Cuentos">Ficción / Cuentos</option>
            <option value="Ciencia y Tecnología">Ciencia y Tecnología</option>
            <option value="Historia">Historia</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={enviando}>
        {enviando ? 'Guardando en API (POST)...' : 'Guardar en Base de Datos'}
      </button>
    </form>
  );
}
