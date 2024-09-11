/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `sizes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "colors_title_key" ON "colors"("title");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_title_key" ON "sizes"("title");
