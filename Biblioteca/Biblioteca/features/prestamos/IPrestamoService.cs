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

public interface IPrestamoService
{
    Task<IEnumerable<PrestamoDetalleDto>> GetAllAsync();
    Task<PrestamoDto> CreateAsync(RegistrarPrestamoDto dto);
    Task<PrestamoDto> ReturnAsync(int id);
}
