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

using Dapper;
using System.Data;

namespace Biblioteca.Features.Prestamos;

public class PrestamoRepository : IPrestamoRepository
{
    private readonly IDbConnection _connection;

    public PrestamoRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<Prestamo?> GetByIdAsync(int id)
    {
        var query = "SELECT Id, SocioId, LibroId, FechaPrestamo, FechaDevolucion FROM Prestamos WHERE Id = @Id";
        return await _connection.QueryFirstOrDefaultAsync<Prestamo>(query, new { Id = id });
    }

    public async Task<IEnumerable<PrestamoDetalleDto>> GetAllDetallesAsync()
    {
        var query = @"SELECT 
                        p.Id, 
                        p.SocioId, 
                        s.NombreCompleto as SocioNombre, 
                        l.ISBN as LibroIsbn, 
                        l.Titulo as LibroTitulo, 
                        p.FechaPrestamo, 
                        p.FechaDevolucion 
                      FROM Prestamos p
                      INNER JOIN Socios s ON p.SocioId = s.Id
                      INNER JOIN Libros l ON p.LibroId = l.Id";
        return await _connection.QueryAsync<PrestamoDetalleDto>(query);
    }

    public async Task<int> GetActivePrestamosCountByLibroIdAsync(int libroId)
    {
        var query = "SELECT COUNT(1) FROM Prestamos WHERE LibroId = @LibroId AND FechaDevolucion IS NULL";
        return await _connection.ExecuteScalarAsync<int>(query, new { LibroId = libroId });
    }

    public async Task<int> CreateAsync(Prestamo prestamo)
    {
        var query = @"INSERT INTO Prestamos (SocioId, LibroId, FechaPrestamo, FechaDevolucion) 
                      OUTPUT INSERTED.Id 
                      VALUES (@SocioId, @LibroId, @FechaPrestamo, @FechaDevolucion)";
        return await _connection.ExecuteScalarAsync<int>(query, prestamo);
    }

    public async Task UpdateAsync(Prestamo prestamo)
    {
        var query = @"UPDATE Prestamos 
                      SET SocioId = @SocioId, LibroId = @LibroId, FechaPrestamo = @FechaPrestamo, FechaDevolucion = @FechaDevolucion 
                      WHERE Id = @Id";
        await _connection.ExecuteAsync(query, prestamo);
    }
}
