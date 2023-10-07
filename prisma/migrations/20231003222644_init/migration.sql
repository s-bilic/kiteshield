/*
  Warnings:

  - Added the required column `factor` to the `Risk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Risk" ADD COLUMN     "factor" DOUBLE PRECISION NOT NULL;
