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

public interface ILibroRepository
{
    Task<Libro?> GetByIdAsync(int id);
    Task<Libro?> GetByIsbnAsync(string isbn);
    Task<IEnumerable<Libro>> GetAllAsync();
    Task<int> CreateAsync(Libro libro);
    Task UpdateAsync(Libro libro);
    Task DeleteAsync(int id);
}
