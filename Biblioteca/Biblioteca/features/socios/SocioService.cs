using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Biblioteca.Features.Socios;

public class SocioService : ISocioService
{
    private readonly ISocioRepository _socioRepository;

    public SocioService(ISocioRepository socioRepository)
    {
        _socioRepository = socioRepository;
    }

    public async Task<IEnumerable<SocioDto>> GetAllAsync(string? nombre)
    {
        var socios = await _socioRepository.GetAllAsync(nombre);
        return socios.Select(s => s.ToResponse());
    }

    public async Task<SocioDto> CreateAsync(CrearSocioDto dto)
    {
        var existingSocio = await _socioRepository.GetByEmailAsync(dto.Email);
        if (existingSocio != null)
            throw new ConflictException($"Ya existe un socio registrado con el email {dto.Email}");

        var socio = dto.ToEntity();
        var newId = await _socioRepository.CreateAsync(socio);

        var createdSocio = await _socioRepository.GetByIdAsync(newId);
        return createdSocio!.ToResponse();
    }
}
