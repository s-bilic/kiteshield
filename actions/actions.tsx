"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { calculateClaimPrice, calculatePriceChange } from "@/lib/utils";
import { getTokenPriceHistory } from "@/lib/api";

const createTransaction = async (
  signature: string,
  decrease: number,
  formData: FormData,
) => {
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;
  const range = formData.get("range");

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

  const { tokenPrice, tokenPriceHistory, token } = singleTransaction;

  // Decide which price point is used to calculate the claimPrice
  // The claimPrice is the price point which makes the user eligible for the insurance claim
  const price = Number(tokenPrice?.price);
  const priceHistory = Number(tokenPriceHistory?.price);
  const priceType =
    price < priceHistory
      ? price
      : price > priceHistory
      ? priceHistory
      : price === priceHistory
      ? null
      : null;

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

  const exists = await prisma.transaction.findFirst({
    where: {
      user: {
        address: userAddress as string,
      },
      signature: signature,
      insured: true,
    },
  });

  if (exists) {
    console.error("An insured transaction already exists for this user.");
  } else {
    const newTransaction = await prisma.transaction.create({
      data: {
        signature: singleTransaction?.signature,
        updatedAt: new Date(),
        timestamp: singleTransaction?.timestamp,
        price: Number(singleTransaction?.tokenPrice?.price),
        priceHistory: Number(singleTransaction?.tokenPriceHistory?.price),
        spend: singleTransaction?.tokenTransfers[0]?.tokenAmount,
        received: singleTransaction?.tokenTransfers[1]?.tokenAmount,
        spendToken: singleTransaction?.tokenTransfers[0]?.mint,
        receivedToken: singleTransaction?.tokenTransfers[1]?.mint,
        insured: true,
        user: {
          connect: { address: userAddress as string },
        },
        Policy: {
          create: {
            premium: 20,
            claim: 40,
            claimPrice: calculateClaimPrice(priceType, decrease),
            range: range as string,
            decrease: decrease,
            dailyPriceChange: calculatePriceChange(price, dailyPriceChange),
            weeklyPriceChange: calculatePriceChange(price, weeklyPriceChange),
            monthlyPriceChange: calculatePriceChange(price, monthlyPriceChange),
            // risk: 0.5,
            user: {
              connect: { address: userAddress as string },
            },
          },
        },
      },
    });

    revalidatePath("/");
  }
};

export { createTransaction };
