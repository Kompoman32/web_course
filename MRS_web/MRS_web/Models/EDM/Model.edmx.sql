
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 04/18/2018 10:37:17
-- Generated from EDMX file: C:\c#\MRS_web\MRS_web\Models\EDM\Model.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [RegisteredMeters];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_MeterParametr_Meter]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MeterParametr] DROP CONSTRAINT [FK_MeterParametr_Meter];
GO
IF OBJECT_ID(N'[dbo].[FK_MeterParametr_Parametr]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MeterParametr] DROP CONSTRAINT [FK_MeterParametr_Parametr];
GO
IF OBJECT_ID(N'[dbo].[FK_MeterTariff]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MeterSet] DROP CONSTRAINT [FK_MeterTariff];
GO
IF OBJECT_ID(N'[dbo].[FK_TypeMeter]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MeterSet] DROP CONSTRAINT [FK_TypeMeter];
GO
IF OBJECT_ID(N'[dbo].[FK_MeterDocument]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[DocumentSet] DROP CONSTRAINT [FK_MeterDocument];
GO
IF OBJECT_ID(N'[dbo].[FK_TariffTimeSpan]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[TimeSpanSet] DROP CONSTRAINT [FK_TariffTimeSpan];
GO
IF OBJECT_ID(N'[dbo].[FK_UserMeter]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MeterSet] DROP CONSTRAINT [FK_UserMeter];
GO
IF OBJECT_ID(N'[dbo].[FK_MeterReading]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[ReadingSet] DROP CONSTRAINT [FK_MeterReading];
GO
IF OBJECT_ID(N'[dbo].[FK_InstalledMeter_inherits_Meter]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[MeterSet_InstalledMeter] DROP CONSTRAINT [FK_InstalledMeter_inherits_Meter];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[MeterSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MeterSet];
GO
IF OBJECT_ID(N'[dbo].[ParametrSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ParametrSet];
GO
IF OBJECT_ID(N'[dbo].[TypeSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[TypeSet];
GO
IF OBJECT_ID(N'[dbo].[UserSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[UserSet];
GO
IF OBJECT_ID(N'[dbo].[DocumentSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[DocumentSet];
GO
IF OBJECT_ID(N'[dbo].[TariffSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[TariffSet];
GO
IF OBJECT_ID(N'[dbo].[TimeSpanSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[TimeSpanSet];
GO
IF OBJECT_ID(N'[dbo].[ReadingSet]', 'U') IS NOT NULL
    DROP TABLE [dbo].[ReadingSet];
GO
IF OBJECT_ID(N'[dbo].[MeterSet_InstalledMeter]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MeterSet_InstalledMeter];
GO
IF OBJECT_ID(N'[dbo].[MeterParametr]', 'U') IS NOT NULL
    DROP TABLE [dbo].[MeterParametr];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'MeterSet'
CREATE TABLE [dbo].[MeterSet] (
    [Name] nvarchar(max)  NOT NULL,
    [Discription] nvarchar(max)  NOT NULL,
    [SumReadings] float  NOT NULL,
    [Capacity] float  NOT NULL,
    [ProductionId] bigint  NOT NULL,
    [ProductionDate] datetime  NOT NULL,
    [Tariff_Id] int  NOT NULL,
    [Type_Id] int  NOT NULL,
    [User_Id] int  NOT NULL
);
GO

-- Creating table 'ParametrSet'
CREATE TABLE [dbo].[ParametrSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [Measure] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'TypeSet'
CREATE TABLE [dbo].[TypeSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [Unit] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'UserSet'
CREATE TABLE [dbo].[UserSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Login] nvarchar(32)  NOT NULL,
    [Password] nvarchar(max)  NOT NULL,
    [FullName] nvarchar(max)  NOT NULL,
    [AdminPrivileges] bit  NOT NULL
);
GO

-- Creating table 'DocumentSet'
CREATE TABLE [dbo].[DocumentSet] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(max)  NOT NULL,
    [Discription] nvarchar(max)  NOT NULL,
    [SigningDate] datetime  NOT NULL,
    [Meter_ProductionId] bigint  NOT NULL
);
GO

-- Creating table 'TariffSet'
CREATE TABLE [dbo].[TariffSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL
);
GO

-- Creating table 'TimeSpanSet'
CREATE TABLE [dbo].[TimeSpanSet] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NOT NULL,
    [TimeStart] time  NOT NULL,
    [TimeEnd] time  NOT NULL,
    [Tariff_Id] int  NOT NULL
);
GO

-- Creating table 'ReadingSet'
CREATE TABLE [dbo].[ReadingSet] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Value] float  NOT NULL,
    [TariffNumber] int  NOT NULL,
    [Meter_ProductionId] bigint  NOT NULL
);
GO

-- Creating table 'MeterSet_InstalledMeter'
CREATE TABLE [dbo].[MeterSet_InstalledMeter] (
    [InstallDate] datetime  NOT NULL,
    [ExpirationDate] datetime  NOT NULL,
    [ProductionId] bigint  NOT NULL
);
GO

-- Creating table 'MeterParametr'
CREATE TABLE [dbo].[MeterParametr] (
    [Meters_ProductionId] bigint  NOT NULL,
    [Parametrs_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [ProductionId] in table 'MeterSet'
ALTER TABLE [dbo].[MeterSet]
ADD CONSTRAINT [PK_MeterSet]
    PRIMARY KEY CLUSTERED ([ProductionId] ASC);
GO

-- Creating primary key on [Id] in table 'ParametrSet'
ALTER TABLE [dbo].[ParametrSet]
ADD CONSTRAINT [PK_ParametrSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'TypeSet'
ALTER TABLE [dbo].[TypeSet]
ADD CONSTRAINT [PK_TypeSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'UserSet'
ALTER TABLE [dbo].[UserSet]
ADD CONSTRAINT [PK_UserSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'DocumentSet'
ALTER TABLE [dbo].[DocumentSet]
ADD CONSTRAINT [PK_DocumentSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'TariffSet'
ALTER TABLE [dbo].[TariffSet]
ADD CONSTRAINT [PK_TariffSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'TimeSpanSet'
ALTER TABLE [dbo].[TimeSpanSet]
ADD CONSTRAINT [PK_TimeSpanSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'ReadingSet'
ALTER TABLE [dbo].[ReadingSet]
ADD CONSTRAINT [PK_ReadingSet]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [ProductionId] in table 'MeterSet_InstalledMeter'
ALTER TABLE [dbo].[MeterSet_InstalledMeter]
ADD CONSTRAINT [PK_MeterSet_InstalledMeter]
    PRIMARY KEY CLUSTERED ([ProductionId] ASC);
GO

-- Creating primary key on [Meters_ProductionId], [Parametrs_Id] in table 'MeterParametr'
ALTER TABLE [dbo].[MeterParametr]
ADD CONSTRAINT [PK_MeterParametr]
    PRIMARY KEY CLUSTERED ([Meters_ProductionId], [Parametrs_Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [Meters_ProductionId] in table 'MeterParametr'
ALTER TABLE [dbo].[MeterParametr]
ADD CONSTRAINT [FK_MeterParametr_Meter]
    FOREIGN KEY ([Meters_ProductionId])
    REFERENCES [dbo].[MeterSet]
        ([ProductionId])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating foreign key on [Parametrs_Id] in table 'MeterParametr'
ALTER TABLE [dbo].[MeterParametr]
ADD CONSTRAINT [FK_MeterParametr_Parametr]
    FOREIGN KEY ([Parametrs_Id])
    REFERENCES [dbo].[ParametrSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MeterParametr_Parametr'
CREATE INDEX [IX_FK_MeterParametr_Parametr]
ON [dbo].[MeterParametr]
    ([Parametrs_Id]);
GO

-- Creating foreign key on [Tariff_Id] in table 'MeterSet'
ALTER TABLE [dbo].[MeterSet]
ADD CONSTRAINT [FK_MeterTariff]
    FOREIGN KEY ([Tariff_Id])
    REFERENCES [dbo].[TariffSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MeterTariff'
CREATE INDEX [IX_FK_MeterTariff]
ON [dbo].[MeterSet]
    ([Tariff_Id]);
GO

-- Creating foreign key on [Type_Id] in table 'MeterSet'
ALTER TABLE [dbo].[MeterSet]
ADD CONSTRAINT [FK_TypeMeter]
    FOREIGN KEY ([Type_Id])
    REFERENCES [dbo].[TypeSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_TypeMeter'
CREATE INDEX [IX_FK_TypeMeter]
ON [dbo].[MeterSet]
    ([Type_Id]);
GO

-- Creating foreign key on [Meter_ProductionId] in table 'DocumentSet'
ALTER TABLE [dbo].[DocumentSet]
ADD CONSTRAINT [FK_MeterDocument]
    FOREIGN KEY ([Meter_ProductionId])
    REFERENCES [dbo].[MeterSet]
        ([ProductionId])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MeterDocument'
CREATE INDEX [IX_FK_MeterDocument]
ON [dbo].[DocumentSet]
    ([Meter_ProductionId]);
GO

-- Creating foreign key on [Tariff_Id] in table 'TimeSpanSet'
ALTER TABLE [dbo].[TimeSpanSet]
ADD CONSTRAINT [FK_TariffTimeSpan]
    FOREIGN KEY ([Tariff_Id])
    REFERENCES [dbo].[TariffSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_TariffTimeSpan'
CREATE INDEX [IX_FK_TariffTimeSpan]
ON [dbo].[TimeSpanSet]
    ([Tariff_Id]);
GO

-- Creating foreign key on [User_Id] in table 'MeterSet'
ALTER TABLE [dbo].[MeterSet]
ADD CONSTRAINT [FK_UserMeter]
    FOREIGN KEY ([User_Id])
    REFERENCES [dbo].[UserSet]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_UserMeter'
CREATE INDEX [IX_FK_UserMeter]
ON [dbo].[MeterSet]
    ([User_Id]);
GO

-- Creating foreign key on [Meter_ProductionId] in table 'ReadingSet'
ALTER TABLE [dbo].[ReadingSet]
ADD CONSTRAINT [FK_MeterReading]
    FOREIGN KEY ([Meter_ProductionId])
    REFERENCES [dbo].[MeterSet]
        ([ProductionId])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_MeterReading'
CREATE INDEX [IX_FK_MeterReading]
ON [dbo].[ReadingSet]
    ([Meter_ProductionId]);
GO

-- Creating foreign key on [ProductionId] in table 'MeterSet_InstalledMeter'
ALTER TABLE [dbo].[MeterSet_InstalledMeter]
ADD CONSTRAINT [FK_InstalledMeter_inherits_Meter]
    FOREIGN KEY ([ProductionId])
    REFERENCES [dbo].[MeterSet]
        ([ProductionId])
    ON DELETE CASCADE ON UPDATE NO ACTION;
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------