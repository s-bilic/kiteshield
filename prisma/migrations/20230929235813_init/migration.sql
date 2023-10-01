/*
  Warnings:

  - You are about to drop the column `receive` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiveToken` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `received` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivedToken` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "receive",
DROP COLUMN "receiveToken",
ADD COLUMN     "received" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "receivedToken" TEXT NOT NULL;
