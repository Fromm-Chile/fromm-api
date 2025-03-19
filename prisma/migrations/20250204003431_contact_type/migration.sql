/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Contact] ADD [contactType] NVARCHAR(1000) NOT NULL CONSTRAINT [Contact_contactType_df] DEFAULT 'CONTACT';

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [address];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
