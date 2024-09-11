/*
  Warnings:

  - You are about to drop the column `images` on the `colors` table. All the data in the column will be lost.
  - Added the required column `image` to the `colors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "colors" DROP COLUMN "images",
ADD COLUMN     "image" TEXT NOT NULL;
