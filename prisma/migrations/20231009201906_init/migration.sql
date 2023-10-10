/*
  Warnings:

  - Added the required column `claimSignature` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completed` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premiumSignature` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "claimSignature" TEXT NOT NULL,
ADD COLUMN     "completed" BOOLEAN NOT NULL,
ADD COLUMN     "premiumSignature" TEXT NOT NULL;
