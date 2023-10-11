import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTokenPriceHistory } from "@/lib/api";
import { calculatePriceChange, calculateRiskFactor } from "@/lib/utils";

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

  const totalPremiumValue = basePremiumValue + basePremiumValue * risk?.factor;
  const totalPremiumTokenValue = totalPremiumValue / priceType;

  console.log(risk, Number(totalPremiumValue), Number(totalPremiumTokenValue));

  return NextResponse.json({
    premiumValue: Number(totalPremiumValue),
    premiumTokenValue: Number(totalPremiumTokenValue),
    risk,
  });
}
