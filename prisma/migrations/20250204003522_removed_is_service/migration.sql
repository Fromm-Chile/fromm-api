/*
  Warnings:

  - You are about to drop the column `isService` on the `Contact` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- Drop the default constraint on the isService column
ALTER TABLE [dbo].[Contact] DROP CONSTRAINT [Contact_isService_df];

-- AlterTable
ALTER TABLE [dbo].[Contact] DROP COLUMN [isService];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH