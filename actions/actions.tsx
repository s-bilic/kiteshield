"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const updateTransaction = async (formData: FormData) => {
  const signature = formData?.signature;
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
      where: { signature: signature },
      data: { insured: true },
    });
    revalidatePath("/");
  }
};

export { updateTransaction };
