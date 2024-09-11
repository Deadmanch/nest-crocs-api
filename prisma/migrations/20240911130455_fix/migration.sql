/*
  Warnings:

  - You are about to drop the column `image` on the `colors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "colors" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
