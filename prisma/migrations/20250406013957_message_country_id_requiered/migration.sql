/*
  Warnings:

  - Made the column `countryId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_countryId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Invoice] ADD [message] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[User] ALTER COLUMN [countryId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_countryId_fkey] FOREIGN KEY ([countryId]) REFERENCES [dbo].[Country]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
