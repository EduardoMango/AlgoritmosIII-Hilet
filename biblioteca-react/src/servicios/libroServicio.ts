import { clienteHttp } from '../api/clienteHttp';
import type { Libro, NuevoLibroDto } from '../types/libro';

/**
 * Servicio de Dominio: LibroServicio
 * ==================================
 * Encapsula todas las operaciones asíncronas sobre el recurso REST `/libros`.
 * Sigue el principio de responsabilidad única: los componentes visuales nunca
 * conocen URLs fijas ni detalles del protocolo HTTP.
 */

const ENDPOINT_LIBROS = '/libros';

/**
 * Obtiene el catálogo completo de libros desde JSON Server.
 */
export async function obtenerLibros(): Promise<Libro[]> {
  const respuesta = await clienteHttp.get<Libro[]>(ENDPOINT_LIBROS);
  return respuesta.data;
}

/**
 * Obtiene un único libro según su identificador.
 */
export async function obtenerLibroPorId(id: number | string): Promise<Libro> {
  const respuesta = await clienteHttp.get<Libro>(`${ENDPOINT_LIBROS}/${id}`);
  return respuesta.data;
}

/**
 * Registra un nuevo libro mediante una petición HTTP POST.
 * JSON Server genera y asigna automáticamente un `id` único.
 */
export async function crearLibro(nuevoLibro: NuevoLibroDto): Promise<Libro> {
  const respuesta = await clienteHttp.post<Libro>(ENDPOINT_LIBROS, nuevoLibro);
  return respuesta.data;
}

/**
 * Actualiza parcialmente un libro existente mediante HTTP PATCH.
 */
export async function actualizarLibro(id: number | string, datos: Partial<Libro>): Promise<Libro> {
  const respuesta = await clienteHttp.patch<Libro>(`${ENDPOINT_LIBROS}/${id}`, datos);
  return respuesta.data;
}

/**
 * Alterna el estado de disponibilidad/préstamo de un libro vía HTTP PATCH.
 */
export async function cambiarDisponibilidadLibro(id: number | string, disponible: boolean): Promise<Libro> {
  return actualizarLibro(id, { disponible });
}

/**
 * Elimina un libro de la base de datos simulada mediante HTTP DELETE.
 */
export async function eliminarLibro(id: number | string): Promise<void> {
  await clienteHttp.delete(`${ENDPOINT_LIBROS}/${id}`);
}

/**
 * Demostración comparativa: Invocación mediante la API nativa fetch.
 * Permite visualizar en clase las diferencias explicadas en la Sección 3.2 del apunte:
 * - Necesidad de validar manualmente `response.ok`.
 * - Invocación explícita a `response.json()`.
 */
export async function obtenerLibrosConFetch(): Promise<Libro[]> {
  const urlBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const respuesta = await fetch(`${urlBase}${ENDPOINT_LIBROS}`);

  if (!respuesta.ok) {
    throw new Error(`Fallo en servicio HTTP con fetch(): Código ${respuesta.status}`);
  }

  const datos: Libro[] = await respuesta.json();
  return datos;
}
