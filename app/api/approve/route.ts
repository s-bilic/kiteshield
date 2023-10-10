import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTokenPriceHistory } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { calculateClaimPrice, calculatePriceChange } from "@/lib/utils";

export async function POST(req: NextRequest, res: NextResponse) {
  const { signature, decrease, range } = await req.json();
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" });
  }

  const body = {
    user: {
      name: userAddress,
    },
  };

  const response = await fetch("http://localhost:3000/api/transactions", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const transactions = await response.json();

  const singleTransaction = transactions?.find(
    (item: any) => item?.signature === signature,
  );

  const { tokenPrice, tokenPriceHistory, token, tokenTransfers } =
    singleTransaction;
  const price = Number(tokenPrice?.price);
  const priceHistory = Number(tokenPriceHistory?.price);
  const tokenAmount = Number(tokenTransfers[1]?.tokenAmount);

  const priceType =
    price < priceHistory
      ? price
      : price > priceHistory
      ? priceHistory
      : price === priceHistory
      ? null
      : null;

  // Dollar worth of the received token in the transaction
  const transactionValue = priceType * tokenAmount;
  const insuredValue = (transactionValue * decrease[0]) / 100;
  const insuredTokenValue = insuredValue / priceType;
  const basePremiumValue = insuredValue / 10;

  // used for risk factor
  const dailyPriceChange = await getTokenPriceHistory(
    token?.id,
    "prevDay",
    true,
  );
  const weeklyPriceChange = await getTokenPriceHistory(
    token?.id,
    "prevWeek",
    true,
  );
  const monthlyPriceChange = await getTokenPriceHistory(
    token?.id,
    "prevMonth",
    true,
  );

  const riskFactor = 1;
  const totalPremiumValue = basePremiumValue + basePremiumValue * riskFactor;
  const totalPremiumTokenValue = totalPremiumValue / priceType;

  const exists = await prisma.transaction.findFirst({
    where: {
      user: {
        address: userAddress as string,
      },
      signature: signature,
    },
  });

  if (exists) {
    console.error("An insured transaction already exists for this user.");
  } else {
    const createRisk = await prisma.transaction.create({
      data: {
        updatedAt: new Date(),
        signature: signature,
        timestamp: singleTransaction?.timestamp,
        price: price,
        priceHistory: priceHistory,
        spend: singleTransaction?.tokenTransfers[0]?.tokenAmount,
        received: singleTransaction?.tokenTransfers[1]?.tokenAmount,
        spendToken: singleTransaction?.tokenTransfers[0]?.mint,
        receivedToken: singleTransaction?.tokenTransfers[1]?.mint,
        user: {
          connect: { address: userAddress as string },
        },
        Policy: {
          create: {
            user: {
              connect: { address: userAddress as string },
            },
            premium: totalPremiumTokenValue,
            claim: insuredTokenValue,
            claimPrice: calculateClaimPrice(priceType, decrease[0]),
            risk: {
              create: {
                updatedAt: new Date(),
                dailyPriceChange: calculatePriceChange(price, dailyPriceChange),
                weeklyPriceChange: calculatePriceChange(
                  price,
                  weeklyPriceChange,
                ),
                monthlyPriceChange: calculatePriceChange(
                  price,
                  monthlyPriceChange,
                ),
                range: range,
                decrease: decrease[0],
                factor: riskFactor,
              },
            },
          },
        },
      },
    });
    console.log(createRisk);
    return NextResponse.json(createRisk);
  }
}
