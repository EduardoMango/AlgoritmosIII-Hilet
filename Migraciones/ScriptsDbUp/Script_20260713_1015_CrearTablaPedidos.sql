-- Creación de la tabla secundaria con clave foránea y valor por defecto de fecha
CREATE TABLE Pedidos (
                         Id INT IDENTITY(1,1) NOT NULL,
                         UsuarioId INT NOT NULL,
                         Fecha DATETIME2 NOT NULL CONSTRAINT DF_Pedidos_Fecha DEFAULT GETDATE(),
                         Total DECIMAL(18,2) NOT NULL,
                         CONSTRAINT PK_Pedidos PRIMARY KEY CLUSTERED (Id),
                         CONSTRAINT FK_Pedidos_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios (Id) ON DELETE CASCADE
);

-- Creación de índice no agrupado para optimizar los JOINs por el campo de relación
CREATE NONCLUSTERED INDEX IX_Pedidos_UsuarioId ON Pedidos (UsuarioId);