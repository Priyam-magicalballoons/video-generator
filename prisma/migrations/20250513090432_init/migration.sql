-- CreateTable
CREATE TABLE "Mr" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "mid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mr_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "speciality" TEXT NOT NULL,
    "clinic" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mrId" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mr_mid_key" ON "Mr"("mid");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_mrId_fkey" FOREIGN KEY ("mrId") REFERENCES "Mr"("id") ON DELETE CASCADE ON UPDATE CASCADE;
