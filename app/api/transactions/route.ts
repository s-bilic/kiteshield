import { NextRequest, NextResponse } from "next/server";
import {
  getTransactions,
  getTokenPriceHistory,
  getTokenPrice,
} from "@/lib/api";
import { pythTokens } from "@/lib/tokens";

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.json();
  const userAddress = data?.user?.name;

  // 1. Get all transactions belonging to the session address
  const transactions = await getTransactions(userAddress as string);
  const filteredTransactions = transactions?.filter(
    (transaction) =>
      transaction?.instructions?.find(
        (instruction) =>
          transaction?.tokenTransfers?.length >= 2 &&
          instruction?.programId ===
            "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
      ),
  );
  // 2. The transactions data does not have all the token information we need.
  // That's why we combine transactions + accepted pyth tokens data here.
  const newTransactions = filteredTransactions?.map((item) => ({
    ...item,
    token: pythTokens?.find(
      (token) => token?.mint === item?.tokenTransfers[1]?.mint,
    ),
  }));

  // 3. The newTransactions is missing current and historic price of the token in the transaction
  // Here we combine the newTransactions + current/historic token price data.
  const output = await Promise.all(
    newTransactions?.map(async (item) => {
      if (!item || !item.token || !item.token.id) {
        return null; // Handle the case where item or item.token.id is missing
      }

      const tokenPrice = await getTokenPrice(item.token.id);
      const tokenPriceHistory = await getTokenPriceHistory(
        item.token.id,
        item.timestamp,
        false,
      );

      return {
        ...item,
        tokenPrice: {
          ...tokenPrice[0]?.price,
          price:
            Number(tokenPrice[0]?.price?.price) *
            Math.pow(10, tokenPrice[0]?.price?.expo),
        },
        tokenPriceHistory: {
          ...tokenPriceHistory?.parsed[0]?.price,
          price:
            Number(tokenPriceHistory?.parsed[0]?.price?.price) *
            Math.pow(10, tokenPriceHistory?.parsed[0]?.price?.expo),
        },
      };
    }),
  );

  return NextResponse.json(output?.filter((item) => item !== null));
}
