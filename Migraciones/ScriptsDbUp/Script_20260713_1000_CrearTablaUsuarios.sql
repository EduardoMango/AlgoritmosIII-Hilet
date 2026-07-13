CREATE TABLE Usuarios (
                          Id INT IDENTITY(1,1) NOT NULL,
                          Nombre NVARCHAR(100) NOT NULL,
                          Email NVARCHAR(150) NOT NULL,
                          CONSTRAINT PK_Usuarios PRIMARY KEY CLUSTERED (Id),
                          CONSTRAINT UQ_Usuarios_Email UNIQUE (Email)
);