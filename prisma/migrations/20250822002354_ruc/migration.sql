BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Banner] ADD [countryId] INT;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [rucPeru] INT;

-- AddForeignKey
ALTER TABLE [dbo].[Banner] ADD CONSTRAINT [Banner_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
