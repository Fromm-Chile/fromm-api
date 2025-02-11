/*
  Warnings:

  - You are about to drop the column `Company` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `Equipment` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `Empresa` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Contact] DROP COLUMN [Company],
[Equipment];
ALTER TABLE [dbo].[Contact] ADD [company] NVARCHAR(1000),
[equipment] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [Empresa];
ALTER TABLE [dbo].[User] ADD [company] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
