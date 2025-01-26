BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(255) NOT NULL,
    [parentCategory] INT,
    CONSTRAINT [PK__categori__3213E83F76BC8ACC] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(50) NOT NULL,
    [phone] VARCHAR(20) NOT NULL,
    [address] VARCHAR(100),
    [email] VARCHAR(50),
    CONSTRAINT [PK__users__3213E83FE0493D4C] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Category] ADD CONSTRAINT [FK__categorie__paren__6477ECF3] FOREIGN KEY ([parentCategory]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
