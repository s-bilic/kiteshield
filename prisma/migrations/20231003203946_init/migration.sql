/*
  Warnings:

  - You are about to drop the column `dailyPriceChange` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyPriceChange` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `priceNow` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `volume` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyPriceChange` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `dailyPriceChange` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyPriceChange` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeklyPriceChange` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceHistory` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "dailyPriceChange" TEXT NOT NULL,
ADD COLUMN     "monthlyPriceChange" TEXT NOT NULL,
ADD COLUMN     "weeklyPriceChange" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "dailyPriceChange",
DROP COLUMN "monthlyPriceChange",
DROP COLUMN "priceNow",
DROP COLUMN "volume",
DROP COLUMN "weeklyPriceChange",
ADD COLUMN     "priceHistory" DOUBLE PRECISION NOT NULL;
