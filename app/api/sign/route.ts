import { NextResponse } from "next/server";

import { SolanaSignInInput } from "@solana/wallet-standard-features";

export async function GET() {
  const signInData: SolanaSignInInput = {
    statement:
      "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
    version: "1",
    nonce: "oBbLoEldZs",
    chainId: "devnet",
    resources: ["https://www.kiteshield.xyz/", "https://phantom.app/"],
  };
  return NextResponse.json(signInData);
}
