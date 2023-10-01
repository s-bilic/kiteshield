/*
  Warnings:

  - Added the required column `claimPrice` to the `Policy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "claimPrice" DOUBLE PRECISION NOT NULL;
