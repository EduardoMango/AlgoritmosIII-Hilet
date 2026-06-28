CREATE TABLE Libros (
                        Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
                        Titulo VARCHAR(200) NOT NULL,
                        Autor VARCHAR(100) NOT NULL,
                        ISBN VARCHAR(20) NOT NULL UNIQUE,
                        CantidadDisponible INT NOT NULL DEFAULT 0
);

CREATE TABLE Socios (
                        Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
                        NombreCompleto VARCHAR(150) NOT NULL,
                        Email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Prestamos (
                           Id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
                           SocioId INT NOT NULL FOREIGN KEY REFERENCES Socios(Id),
                           LibroId INT NOT NULL FOREIGN KEY REFERENCES Libros(Id),
                           FechaPrestamo DATETIME NOT NULL DEFAULT GETDATE(),
                           FechaDevolucion DATETIME NULL
);