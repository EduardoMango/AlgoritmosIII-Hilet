using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Biblioteca.Features.Prestamos;

public class PrestamoService : IPrestamoService
{
    private readonly IPrestamoRepository _prestamoRepository;
    private readonly ISocioRepository _socioRepository;
    private readonly ILibroRepository _libroRepository;

    public PrestamoService(
        IPrestamoRepository prestamoRepository,
        ISocioRepository socioRepository,
        ILibroRepository libroRepository)
    {
        _prestamoRepository = prestamoRepository;
        _socioRepository = socioRepository;
        _libroRepository = libroRepository;
    }

    public async Task<IEnumerable<PrestamoDetalleDto>> GetAllAsync()
    {
        return await _prestamoRepository.GetAllDetallesAsync();
    }

    public async Task<PrestamoDto> CreateAsync(RegistrarPrestamoDto dto)
    {
        var socio = await _socioRepository.GetByIdAsync(dto.SocioId);
        if (socio == null)
            throw new NotFoundException($"No se encontro el socio con id {dto.SocioId}");

        var libro = await _libroRepository.GetByIdAsync(dto.LibroId);
        if (libro == null)
            throw new NotFoundException($"No se encontro el libro con id {dto.LibroId}");

        if (libro.CantidadDisponible <= 0)
            throw new BadRequestException("El libro no posee stock disponible para prestar");

        var prestamo = dto.ToEntity();

        // Sustrae el stock y actualiza
        var updatedLibro = libro with { CantidadDisponible = libro.CantidadDisponible - 1 };
        await _libroRepository.UpdateAsync(updatedLibro);

        var newId = await _prestamoRepository.CreateAsync(prestamo);
        var createdPrestamo = await _prestamoRepository.GetByIdAsync(newId);

        return createdPrestamo!.ToResponse();
    }

    public async Task<PrestamoDto> ReturnAsync(int id)
    {
        var prestamo = await _prestamoRepository.GetByIdAsync(id);
        if (prestamo == null)
            throw new NotFoundException($"No se encontro el prestamo con id {id}");

        if (prestamo.FechaDevolucion != null)
            throw new BadRequestException("El prestamo ya se encuentra devuelto");

        var libro = await _libroRepository.GetByIdAsync(prestamo.LibroId);
        if (libro == null)
            throw new NotFoundException($"El libro asociado al prestamo no existe (id {prestamo.LibroId})");

        // Incrementa el stock remanente
        var updatedLibro = libro with { CantidadDisponible = libro.CantidadDisponible + 1 };
        await _libroRepository.UpdateAsync(updatedLibro);

        // Actualiza la fecha de devolucion
        var updatedPrestamo = prestamo with { FechaDevolucion = DateTime.UtcNow };
        await _prestamoRepository.UpdateAsync(updatedPrestamo);

        return updatedPrestamo.ToResponse();
    }
}
