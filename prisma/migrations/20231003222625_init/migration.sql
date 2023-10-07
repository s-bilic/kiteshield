/*
  Warnings:

  - You are about to drop the column `risk` on the `Policy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "risk",
ADD COLUMN     "riskId" INTEGER;

-- CreateTable
CREATE TABLE "Risk" (
    "id" SERIAL NOT NULL,
    "dailyPriceChange" TEXT NOT NULL,
    "weeklyPriceChange" TEXT NOT NULL,
    "monthlyPriceChange" TEXT NOT NULL,
    "range" TEXT NOT NULL,
    "decrease" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "Risk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
