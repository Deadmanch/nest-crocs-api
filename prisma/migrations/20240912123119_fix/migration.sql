/*
  Warnings:

  - You are about to drop the column `otpAuth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `otpSecret` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "otpAuth",
DROP COLUMN "otpSecret";
