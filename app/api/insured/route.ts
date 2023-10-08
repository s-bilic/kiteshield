import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateTransaction } from "@/actions/actions";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;
  console.log(session, "x");

  const data = await prisma.transaction.findMany({
    where: {
      insured: true,
      user: {
        address: userAddress as string,
      },
    },
  });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { signature } = await req.json();
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;

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
    console.error("This condition can not be met");
  } else {
    const updatedTransaction = await prisma.transaction.updateMany({
      where: {
        signature: signature,
        user: {
          address: userAddress as string,
        },
      },
      data: { insured: true },
    });
    console.log(updatedTransaction);
    return NextResponse.json(updatedTransaction);
  }
}
