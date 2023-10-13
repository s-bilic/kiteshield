/*
  Warnings:

  - Added the required column `level` to the `Risk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Risk" ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "reasons" TEXT[];
