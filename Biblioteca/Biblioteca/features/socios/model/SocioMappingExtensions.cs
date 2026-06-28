using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

namespace Biblioteca.Features.Socios.Model;

public static class SocioMappingExtensions
{
    public static SocioEntity ToEntity(this CrearSocioDto dto)
    {
        return new SocioEntity(0, dto.NombreCompleto, dto.Email);
    }

    public static SocioDto ToResponse(this SocioEntity entity)
    {
        return new SocioDto(entity.Id, entity.NombreCompleto, entity.Email);
    }
}
