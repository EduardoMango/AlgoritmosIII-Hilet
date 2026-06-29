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

namespace Biblioteca.Features.Socios;

public interface ISocioRepository
{
    Task<SocioEntity?> GetByIdAsync(int id);
    Task<SocioEntity?> GetByEmailAsync(string email);
    Task<IEnumerable<SocioEntity>> GetAllAsync(string? nombre);
    Task<int> CreateAsync(SocioEntity socioEntity);
}
