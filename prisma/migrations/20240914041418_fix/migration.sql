/*
  Warnings:

  - You are about to drop the column `discont` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - Added the required column `original_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "discont",
DROP COLUMN "price",
ADD COLUMN     "discounted_price" DOUBLE PRECISION,
ADD COLUMN     "original_price" DOUBLE PRECISION NOT NULL;
