/*
  Warnings:

  - A unique constraint covering the columns `[parentCategory]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dni` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__categori__3213E83F76BC8ACC', N'Category_pkey';
ALTER TABLE [dbo].[Category] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Category] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [Category_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[Product] ALTER COLUMN [slug] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [alt] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [subtitle] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[Product] ALTER COLUMN [desc] NVARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[Product] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [Product_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2;

-- AlterTable
EXEC SP_RENAME N'dbo.PK__users__3213E83FE0493D4C', N'User_pkey';
ALTER TABLE [dbo].[User] ALTER COLUMN [name] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [phone] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [address] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [email] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ALTER COLUMN [dni] NVARCHAR(1000) NOT NULL;
ALTER TABLE [dbo].[User] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[updatedAt] DATETIME2;

-- CreateTable
CREATE TABLE [dbo].[Image] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productId] INT NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Image_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    CONSTRAINT [Image_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Invoice] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Invoice_status_df] DEFAULT 'PENDING',
    [total] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Invoice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    CONSTRAINT [Invoice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InvoiceDetail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [invoiceId] INT NOT NULL,
    [productId] INT NOT NULL,
    [quantity] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [InvoiceDetail_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    CONSTRAINT [InvoiceDetail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Contact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Contact_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2,
    CONSTRAINT [Contact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[Category] ADD CONSTRAINT [Category_parentCategory_key] UNIQUE NONCLUSTERED ([parentCategory]);

-- RenameForeignKey
EXEC sp_rename 'dbo.FK__categorie__paren__6477ECF3', 'Category_parentCategory_fkey', 'OBJECT';

-- AddForeignKey
ALTER TABLE [dbo].[Image] ADD CONSTRAINT [Image_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Invoice] ADD CONSTRAINT [Invoice_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceDetail] ADD CONSTRAINT [InvoiceDetail_invoiceId_fkey] FOREIGN KEY ([invoiceId]) REFERENCES [dbo].[Invoice]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvoiceDetail] ADD CONSTRAINT [InvoiceDetail_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[Product]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Contact] ADD CONSTRAINT [Contact_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
