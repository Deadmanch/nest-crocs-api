/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_token_key" ON "orders"("token");
