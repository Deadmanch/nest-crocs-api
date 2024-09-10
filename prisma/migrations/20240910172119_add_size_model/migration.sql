/*
  Warnings:

  - You are about to drop the column `sizes` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "colors" ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "sizes";

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToSize" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToSize_AB_unique" ON "_ProductToSize"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToSize_B_index" ON "_ProductToSize"("B");

-- AddForeignKey
ALTER TABLE "_ProductToSize" ADD CONSTRAINT "_ProductToSize_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToSize" ADD CONSTRAINT "_ProductToSize_B_fkey" FOREIGN KEY ("B") REFERENCES "sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
