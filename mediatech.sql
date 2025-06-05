-- Crear base de datos
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
    doc_ubication NVARCHAR(255)
);
GO

-- Tabla [User] (nombre reservado, usamos corchetes)
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
    CONSTRAINT FK_Quote_FirstInvolved FOREIGN KEY (first_involved) REFERENCES Involved(dni),
    CONSTRAINT FK_Quote_SecondInvolved FOREIGN KEY (second_involved) REFERENCES Involved(dni)
);
GO

-- Tabla [Case] (nombre reservado, usamos corchetes)
CREATE TABLE [Case] (
    id VARCHAR(10) PRIMARY KEY, -- formato 0000000001 como texto
    first_involved VARCHAR(10),
    second_involved VARCHAR(10),
    [status] NVARCHAR(50),
    [subject] NVARCHAR(100),
    subsubject NVARCHAR(100),
    [description] NVARCHAR(MAX),
    CONSTRAINT FK_Case_FirstInvolved FOREIGN KEY (first_involved) REFERENCES Involved(dni),
    CONSTRAINT FK_Case_SecondInvolved FOREIGN KEY (second_involved) REFERENCES Involved(dni)
);
GO

-- Trigger para autogenerar id en formato 0000000001
CREATE TRIGGER trg_Case_Id
ON [Case]
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @NextId BIGINT;

    -- Obtener el siguiente número secuencial
    SELECT @NextId = ISNULL(MAX(CAST(id AS BIGINT)), 0) + 1 FROM [Case];

    -- Insertar con id formateado
    INSERT INTO [Case] (id, first_involved, second_involved, status, subject, subsubject, description)
    SELECT 
        RIGHT('0000000000' + CAST(@NextId AS VARCHAR), 10),
        first_involved,
        second_involved,
        status,
        subject,
        subsubject,
        description
    FROM inserted;
END;
GO
