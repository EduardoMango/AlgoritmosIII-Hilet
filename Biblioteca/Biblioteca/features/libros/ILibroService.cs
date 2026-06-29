using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Biblioteca.Features.Libros;

public interface ILibroService
{
    Task<IEnumerable<LibroDto>> GetAllAsync(LibroQueryFilter filtrado);
    Task<LibroDto> GetByIsbnAsync(string isbn);
    Task<LibroDto> CreateAsync(CrearLibroDto dto);
    Task<LibroDto> UpdateAsync(string isbn, ModificarLibroDto dto);
    Task DeleteAsync(string isbn);
}
