-- Creación de la tercera tabla de la jerarquía relacional
CREATE TABLE PedidoDetalles (
                                Id INT IDENTITY(1,1) NOT NULL,
                                PedidoId INT NOT NULL,
                                Producto NVARCHAR(150) NOT NULL,
                                Cantidad INT NOT NULL,
                                PrecioUnitario DECIMAL(18,2) NOT NULL,
                                CONSTRAINT PK_PedidoDetalles PRIMARY KEY CLUSTERED (Id),
                                CONSTRAINT FK_PedidoDetalles_Pedidos FOREIGN KEY (PedidoId) REFERENCES Pedidos (Id) ON DELETE CASCADE
);