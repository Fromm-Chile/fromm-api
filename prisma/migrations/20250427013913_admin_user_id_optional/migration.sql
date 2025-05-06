BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[InvoiceEventHistory] DROP CONSTRAINT [InvoiceEventHistory_adminUserId_fkey];

-- AlterTable
ALTER TABLE [dbo].[InvoiceEventHistory] ALTER COLUMN [adminUserId] INT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceEventHistory] ADD CONSTRAINT [InvoiceEventHistory_adminUserId_fkey] FOREIGN KEY ([adminUserId]) REFERENCES [dbo].[UserAdmin]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
