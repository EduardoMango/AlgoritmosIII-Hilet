import { useState, type SubmitEvent, type ChangeEvent } from 'react';
import type { Libro } from '../types/libro';

interface LibroFormProps {
  /** Función callback que recibe el nuevo libro creado para insertarlo en el estado padre */
  onAgregarLibro: (nuevoLibro: Libro) => void;
}

/**
 * Componente LibroForm
 * =====================
 * Demuestra el patrón de COMPONENTE CONTROLADO (Controlled Component):
 * 1. Cada campo de entrada (<input>, <select>) tiene su atributo `value` enlazado
 *    a una variable de estado local (`useState`).
 * 2. Cada pulsación del usuario dispara `onChange`, actualizando el estado de React.
 * 3. React actúa como la "Fuente Única de Verdad" (Single Source of Truth).
 * 4. El envío utiliza `e.preventDefault()` para evitar la recarga sincrónica de la página web.
 */
export function LibroForm({ onAgregarLibro }: LibroFormProps) {
  // Estados locales independientes para cada campo del formulario (Estrategia Atómica)
  const [titulo, setTitulo] = useState<string>('');
  const [autor, setAutor] = useState<string>('');
  const [genero, setGenero] = useState<string>('Programación');
  const [error, setError] = useState<string>('');

  function manejarSubmit(e: SubmitEvent<HTMLFormElement>) {
    // 1. Cancelamos el comportamiento predeterminado del navegador (recarga del documento)
    e.preventDefault();

    // 2. Validación simple de campos obligatorios
    if (!titulo.trim() || !autor.trim()) {
      setError('El título y el autor son obligatorios.');
      return;
    }

    // 3. Construimos el nuevo objeto de forma inmutable
    const nuevoLibro: Libro = {
      id: Date.now(), // Identificador único generado por timestamp
      titulo: titulo.trim(),
      autor: autor.trim(),
      genero,
      disponible: true,
    };

    // 4. Notificamos al componente padre
    onAgregarLibro(nuevoLibro);

    // 5. Limpiamos los campos del formulario reseteando el estado
    setTitulo('');
    setAutor('');
    setGenero('Programación');
    setError('');
  }

  return (
    <form className="card form-libro" onSubmit={manejarSubmit}>
      <div className="card-header">
        <h3>➕ Agregar Nuevo Libro (Formulario Controlado)</h3>
        <p className="card-subtitle">
          Utiliza <code>useState</code> para sincronizar los inputs con la memoria de React.
        </p>
      </div>

      {error && <div className="alerta-error">{error}</div>}

      <div className="form-grid">
        {/* Campo Título */}
        <div className="form-group">
          <label htmlFor="titulo">Título del Libro:</label>
          <input
            id="titulo"
            type="text"
            placeholder="Ej: El Principito"
            value={titulo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTitulo(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        {/* Campo Autor */}
        <div className="form-group">
          <label htmlFor="autor">Autor:</label>
          <input
            id="autor"
            type="text"
            placeholder="Ej: Antoine de Saint-Exupéry"
            value={autor}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setAutor(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        {/* Selector de Género */}
        <div className="form-group">
          <label htmlFor="genero">Categoría / Género:</label>
          <select
            id="genero"
            value={genero}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenero(e.target.value)}
          >
            <option value="Programación">Programación</option>
            <option value="Arquitectura de Software">Arquitectura de Software</option>
            <option value="Novela / Ficción">Novela / Ficción</option>
            <option value="Ciencia y Tecnología">Ciencia y Tecnología</option>
            <option value="Historia">Historia</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar en Biblioteca
      </button>
    </form>
  );
}
