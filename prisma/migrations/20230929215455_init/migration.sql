-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "signature" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "spend" DOUBLE PRECISION NOT NULL,
    "receive" DOUBLE PRECISION NOT NULL,
    "spendToken" TEXT NOT NULL,
    "receiveToken" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceNow" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "dailyPriceChange" DOUBLE PRECISION NOT NULL,
    "weeklyPriceChange" DOUBLE PRECISION NOT NULL,
    "monthlyPriceChange" DOUBLE PRECISION NOT NULL,
    "insured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "claim" DOUBLE PRECISION NOT NULL,
    "range" DOUBLE PRECISION NOT NULL,
    "decrease" DOUBLE PRECISION NOT NULL,
    "risk" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
