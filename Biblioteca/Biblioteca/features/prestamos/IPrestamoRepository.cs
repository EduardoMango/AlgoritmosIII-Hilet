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

namespace Biblioteca.Features.Prestamos;

public interface IPrestamoRepository
{
    Task<Prestamo?> GetByIdAsync(int id);
    Task<IEnumerable<PrestamoDetalleDto>> GetAllDetallesAsync();
    Task<int> GetActivePrestamosCountByLibroIdAsync(int libroId);
    Task<int> CreateAsync(Prestamo prestamo);
    Task UpdateAsync(Prestamo prestamo);
}
