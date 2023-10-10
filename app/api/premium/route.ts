import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateTransaction } from "@/actions/actions";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" });
  }

  const data = await prisma.transaction.findMany({
    where: {
      insured: true,
      user: {
        address: userAddress as string,
      },
    },
    include: {
      Policy: {
        include: {
          risk: true,
        },
      },
    },
  });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { signature, premiumSignature } = await req.json();
  console.log(signature, "s");
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;

  const transaction = await prisma.transaction.findFirst({
    where: {
      user: {
        address: userAddress as string,
      },
      signature: signature,
    },
    include: {
      Policy: true,
    },
  });

  if (transaction?.insured) {
    console.error("This condition can not be met");
  } else {
    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: transaction?.id,
      },
      data: {
        insured: true,
      },
    });

    const updatedPolicy = await prisma.policy.update({
      where: {
        id: transaction?.Policy[0]?.id,
        transactionId: transaction?.id,
      },
      data: {
        premiumSignature: premiumSignature,
      },
    });

    console.log(updatedTransaction);
    return NextResponse.json(updatedTransaction);
  }
}
