/*
  Warnings:

  - You are about to drop the column `accountId` on the `Role` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_accountId_fkey";

-- DropIndex
DROP INDEX "Role_accountId_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "roleId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "accountId";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
