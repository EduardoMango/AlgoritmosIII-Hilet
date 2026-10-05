/**
 * Definición de tipos y modelos del dominio para la Biblioteca.
 * Cátedra: Algoritmos III - Instituto Hilet (Bloque 3: APIs y useEffect)
 */

/**
 * Modelo de datos principal de un libro en la biblioteca.
 * El campo `id` admite `number | string` para compatibilidad total con json-server y bases de datos REST.
 */
export interface Libro {
  id: number | string;
  titulo: string;
  autor: string;
  genero: string;
  disponible: boolean;
}

/**
 * DTO (Data Transfer Object) para la creación de un nuevo libro.
 * Omite el identificador `id`, el cual es asignado automáticamente por el servidor.
 */
export type NuevoLibroDto = Omit<Libro, 'id'>;

/**
 * Filtro de disponibilidad permitido en la interfaz.
 */
export type FiltroDisponibilidad = 'todos' | 'disponibles' | 'prestados';

/**
 * Estructura de triplete de asincronía tipada para operaciones de red.
 */
export interface EstadoPeticion<T> {
  datos: T;
  cargando: boolean;
  error: string | null;
}
