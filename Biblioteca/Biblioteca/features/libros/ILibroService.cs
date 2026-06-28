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
    Task<IEnumerable<LibroDto>> GetAllAsync();
    Task<LibroDto> GetByIdAsync(int id);
    Task<LibroDto> CreateAsync(CrearLibroDto dto);
    Task<LibroDto> UpdateAsync(int id, ModificarLibroDto dto);
    Task DeleteAsync(int id);
}
