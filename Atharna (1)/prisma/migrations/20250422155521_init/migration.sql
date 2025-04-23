-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CITYS_HISTORY', 'COPTIC', 'GREEK', 'HISTORIC', 'ISLAMIC', 'MILITARY', 'OTTOMAN', 'PHARAONIC', 'ROMANIAN', 'ROYAL', 'SUNKEN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Governorate" AS ENUM ('ALEXANDRIA', 'ASWAN', 'ASYUT', 'BEHIRA', 'BENI_SUEF', 'CAIRO', 'DAKAHLIA', 'DUMYETTA', 'FAYOUM', 'GHARBIA', 'GIZA', 'ISMAILIA', 'KAFR_ELSHEIKH', 'LUXOR', 'MATRUH', 'MINYA', 'MONOFIA', 'NEW_VALLEY', 'NORTH_SINAI', 'PORTSAID', 'QALYUBIA', 'QENNA', 'RED_SEA', 'SHARQIA', 'SOUTH_SINAI', 'SUEZ', 'SUHAG');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "Fname" TEXT NOT NULL,
    "Lname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Museum" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Category" NOT NULL DEFAULT 'UNKNOWN',
    "location" "Governorate" NOT NULL DEFAULT 'CAIRO',
    "info" TEXT NOT NULL,
    "ticketPrice" INTEGER NOT NULL,

    CONSTRAINT "Museum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
