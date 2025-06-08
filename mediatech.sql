-- Crear la base de datos
CREATE DATABASE Mediatech;
GO

-- Usar la base de datos
USE Mediatech;
GO

-- Tabla Involved
CREATE TABLE Involved (
    dni VARCHAR(10) PRIMARY KEY,
    [name] NVARCHAR(100),
    lastname NVARCHAR(100),
    cellphone VARCHAR(15),
    email NVARCHAR(100),
);
GO

-- Tabla [User]
CREATE TABLE [User] (
    email NVARCHAR(100) PRIMARY KEY,
    dni VARCHAR(10),
    [name] NVARCHAR(100),
    lastname NVARCHAR(100),
    cellphone VARCHAR(15),
    [address] NVARCHAR(255),
    photo VARBINARY(MAX),
    [password] NVARCHAR(255),
    position NVARCHAR(100)
);
GO

-- Tabla Quote
CREATE TABLE Quote (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_involved VARCHAR(10),
    second_involved VARCHAR(10),
    [date] DATE,
    start_hour TIME,
    end_hour TIME,
    [description] NVARCHAR(MAX),
	[status] NVARCHAR(10) 
        CONSTRAINT CHK_Status CHECK (status IN ('activo', 'inactivo'))
        CONSTRAINT DF_Status DEFAULT 'activo',
    CONSTRAINT FK_Quote_FirstInvolved FOREIGN KEY (first_involved) REFERENCES Involved(dni),
    CONSTRAINT FK_Quote_SecondInvolved FOREIGN KEY (second_involved) REFERENCES Involved(dni)
);
GO

-- Tabla [Case]
CREATE TABLE [Case] (
    id VARCHAR(10) PRIMARY KEY, 
    first_involved VARCHAR(10),
    second_involved VARCHAR(10),
    [status] NVARCHAR(50),
    [subject] NVARCHAR(100),
    [description] NVARCHAR(MAX),
    register_date DATE,       
    register_time TIME,       
    CONSTRAINT FK_Case_FirstInvolved FOREIGN KEY (first_involved) REFERENCES Involved(dni),
    CONSTRAINT FK_Case_SecondInvolved FOREIGN KEY (second_involved) REFERENCES Involved(dni)
);
GO

-- Trigger para generar ID, fecha y hora
CREATE TRIGGER trg_Case_Id
ON [Case]
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @NextId BIGINT;

    -- Obtener siguiente número secuencial
    SELECT @NextId = ISNULL(MAX(CAST(id AS BIGINT)), 0) + 1 FROM [Case];

    -- Insertar con id formateado, fecha y hora actuales
    INSERT INTO [Case] (
        id, 
        first_involved, 
        second_involved, 
        status, 
        subject, 
        description,
        register_date,
        register_time
    )
    SELECT 
        RIGHT('0000000000' + CAST(@NextId AS VARCHAR), 10),
        first_involved,
        second_involved,
        status,
        subject,
        description,
        CAST(GETDATE() AS DATE),   
        CAST(GETDATE() AS TIME)
    FROM inserted;
END;
GO
