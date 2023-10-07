/*
  Warnings:

  - You are about to drop the column `dailyPriceChange` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `decrease` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyPriceChange` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `range` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyPriceChange` on the `Policy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "dailyPriceChange",
DROP COLUMN "decrease",
DROP COLUMN "monthlyPriceChange",
DROP COLUMN "range",
DROP COLUMN "weeklyPriceChange";
