BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Product] (
    [id] INT NOT NULL IDENTITY(1,1),
    [slug] NVARCHAR(255) NOT NULL,
    [alt] NVARCHAR(255) NOT NULL,
    [categoryId] INT NOT NULL,
    [name] NVARCHAR(255) NOT NULL,
    [subtitle] NVARCHAR(255) NOT NULL,
    [desc] NVARCHAR(255) NOT NULL,
    [jsonDetails] NVARCHAR(max) NOT NULL,
    CONSTRAINT [Product_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Category]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
