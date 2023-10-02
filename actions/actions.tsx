"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const claimPrice = (price: number, decrease: number) => {
  return price - (price * decrease) / 100;
};

const createTransaction = async (
  signature: string,
  decrease: number,
  formData: FormData,
) => {
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;
  console.log(session, "x");

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
        price: Number(singleTransaction?.tokenPriceHistory?.price),
        priceNow: Number(singleTransaction?.tokenPrice?.price),
        volume: 1000000,
        dailyPriceChange: "5%",
        weeklyPriceChange: "10%",
        monthlyPriceChange: "15%",
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
            range: range as string,
            decrease: decrease,
            claimPrice: claimPrice(
              singleTransaction?.tokenPrice?.price,
              decrease,
            ),
            risk: 0.5,
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
