import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
