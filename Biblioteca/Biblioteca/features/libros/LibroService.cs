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

namespace Biblioteca.Features.Libros;

public class LibroService : ILibroService
{
    private readonly ILibroRepository _libroRepository;
    private readonly IPrestamoRepository _prestamoRepository;

    public LibroService(ILibroRepository libroRepository, IPrestamoRepository prestamoRepository)
    {
        _libroRepository = libroRepository;
        _prestamoRepository = prestamoRepository;
    }

    public async Task<IEnumerable<LibroDto>> GetAllAsync()
    {
        var libros = await _libroRepository.GetAllAsync();
        return libros.Select(l => l.ToResponse());
    }

    public async Task<LibroDto> GetByIdAsync(int id)
    {
        var libro = await _libroRepository.GetByIdAsync(id);
        if (libro == null)
            throw new NotFoundException($"No se encontro el libro con id {id}");

        return libro.ToResponse();
    }

    public async Task<LibroDto> CreateAsync(CrearLibroDto dto)
    {
        var existingLibro = await _libroRepository.GetByIsbnAsync(dto.Isbn);
        if (existingLibro != null)
            throw new ConflictException($"Ya existe un libro con el ISBN {dto.Isbn}");

        var libro = dto.ToEntity();
        var newId = await _libroRepository.CreateAsync(libro);

        var createdLibro = await _libroRepository.GetByIdAsync(newId);
        return createdLibro!.ToResponse();
    }

    public async Task<LibroDto> UpdateAsync(int id, ModificarLibroDto dto)
    {
        var libro = await _libroRepository.GetByIdAsync(id);
        if (libro == null)
            throw new NotFoundException($"No se encontro el libro con id {id}");

        if (libro.Isbn != dto.Isbn)
        {
            var existingLibro = await _libroRepository.GetByIsbnAsync(dto.Isbn);
            if (existingLibro != null)
                throw new ConflictException($"Ya existe otro libro con el ISBN {dto.Isbn}");
        }

        var updatedLibro = dto.ToEntity(id);
        await _libroRepository.UpdateAsync(updatedLibro);

        return updatedLibro.ToResponse();
    }

    public async Task DeleteAsync(int id)
    {
        var libro = await _libroRepository.GetByIdAsync(id);
        if (libro == null)
            throw new NotFoundException($"No se encontro el libro con id {id}");

        var activePrestamosCount = await _prestamoRepository.GetActivePrestamosCountByLibroIdAsync(id);
        if (activePrestamosCount > 0)
            throw new BadRequestException("No se puede eliminar el libro porque tiene prestamos activos sin devolver");

        await _libroRepository.DeleteAsync(id);
    }
}
