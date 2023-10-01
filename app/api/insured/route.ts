import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const claimPrice = (price: number, decrease: number) => {
  return price - (price * decrease) / 100;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;
  console.log(userAddress);
  const data = await req.json();

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
    (item: any) => item?.signature === data?.transaction?.signature,
  );

  const exists = await prisma.transaction.findFirst({
    where: {
      user: {
        address: userAddress as string,
      },
      signature: data?.transaction?.signature,
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
            range: data?.policy?.range,
            decrease: data?.policy?.decrease,
            claimPrice: claimPrice(
              singleTransaction?.tokenPrice?.price,
              data?.policy?.decrease,
            ),
            risk: 0.5,
            user: {
              connect: { address: userAddress as string },
            },
          },
        },
      },
    });
    return NextResponse.json(newTransaction);
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;

  const data = await prisma.transaction.findMany({
    where: {
      user: {
        address: userAddress as string,
      },
    },
  });
  return NextResponse.json(data);
}
