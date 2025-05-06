BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Invoice] ADD [invoiceURL] NVARCHAR(1000),
[totalAmount] INT;

-- CreateTable
CREATE TABLE [dbo].[InvoiceEventHistory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoiceId] INT NOT NULL,
    [adminUserId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InvoiceEventHistory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [InvoiceEventHistory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceEventHistory] ADD CONSTRAINT [InvoiceEventHistory_invoiceId_fkey] FOREIGN KEY ([invoiceId]) REFERENCES [dbo].[Invoice]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceEventHistory] ADD CONSTRAINT [InvoiceEventHistory_adminUserId_fkey] FOREIGN KEY ([adminUserId]) REFERENCES [dbo].[UserAdmin]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
