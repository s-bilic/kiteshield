import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTokenPriceHistory } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import {
  calculateClaimPrice,
  calculatePriceChange,
  calculateRiskFactor,
} from "@/lib/utils";

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

  const dailyPriceHistory = await getTokenPriceHistory(
    token?.id,
    "prevDay",
    true,
  );
  const weeklyPriceHistory = await getTokenPriceHistory(
    token?.id,
    "prevWeek",
    true,
  );
  const monthlyPriceHistory = await getTokenPriceHistory(
    token?.id,
    "prevMonth",
    true,
  );

  // TO-DO: Make risk factor calculation
  const dailyPriceChange = calculatePriceChange(price, dailyPriceHistory);
  const weeklyPriceChange = calculatePriceChange(price, weeklyPriceHistory);
  const monthlyPriceChange = calculatePriceChange(price, monthlyPriceHistory);

  const risk = calculateRiskFactor(
    dailyPriceChange,
    weeklyPriceChange,
    monthlyPriceChange,
    decrease,
    range,
  );

  console.log(risk);

  const totalPremiumValue = basePremiumValue + basePremiumValue * risk?.factor;
  const totalPremiumTokenValue = totalPremiumValue / priceType;

  const exists = await prisma.transaction.findFirst({
    where: {
      user: {
        address: userAddress as string,
      },
      signature: signature,
    },
    include: {
      Policy: {
        include: {
          risk: true,
        },
      },
    },
  });

  if (exists) {
    if (exists?.insured) {
      console.error("An insured transaction already exists for this user.");
    } else {
      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: exists.id,
        },
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
            update: {
              where: {
                id: exists?.Policy[0]?.id,
              },
              data: {
                user: {
                  connect: { address: userAddress as string },
                },
                premium: totalPremiumTokenValue,
                claim: insuredTokenValue,
                claimPrice: calculateClaimPrice(priceType, decrease[0]),
                risk: {
                  update: {
                    where: {
                      id: exists?.Policy[0]?.risk?.id,
                    },
                    data: {
                      updatedAt: new Date(),
                      dailyPriceChange: dailyPriceChange,
                      weeklyPriceChange: weeklyPriceChange,
                      monthlyPriceChange: monthlyPriceChange,
                      range: range,
                      decrease: decrease[0],
                      factor: risk?.factor,
                      level: risk?.level,
                      reasons: risk?.reasons,
                    },
                  },
                },
              },
            },
          },
        },
      });

      console.log(updatedTransaction, "updated");

      return NextResponse.json(updatedTransaction);
    }
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
                dailyPriceChange: dailyPriceChange,
                weeklyPriceChange: weeklyPriceChange,
                monthlyPriceChange: monthlyPriceChange,
                range: range,
                decrease: decrease[0],
                factor: risk?.factor,
                level: risk?.level,
                reasons: risk?.reasons,
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
