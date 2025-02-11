/*
  Warnings:

  - You are about to drop the column `total` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `dni` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Contact] ALTER COLUMN [phone] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[Contact] ADD [Company] NVARCHAR(1000),
[Equipment] NVARCHAR(1000),
[isService] BIT NOT NULL CONSTRAINT [Contact_isService_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[Invoice] DROP COLUMN [total];

-- AlterTable
ALTER TABLE [dbo].[User] ALTER COLUMN [phone] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] DROP COLUMN [dni];
ALTER TABLE [dbo].[User] ADD [Empresa] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
