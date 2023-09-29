import { NextResponse } from "next/server";

import { SolanaSignInInput } from "@solana/wallet-standard-features";

export async function GET() {
  const now: Date = new Date();
  // const uri = window.location.href;
  // const currentUrl = new URL(uri);
  // const domain = currentUrl.host;

  // Convert the Date object to a string
  const currentDateTime = now.toISOString();

  // signInData can be kept empty in most cases: all fields are optional
  // const signInData: SolanaSignInInput = {};

  const signInData: SolanaSignInInput = {
    // domain,
    address: "ARLQYuL9HEoUtBXpDG26YyvGUAnHJfYbLSstvrm1vS24",
    statement:
      "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.",
    version: "1",
    nonce: "oBbLoEldZs",
    chainId: "devnet",
    issuedAt: currentDateTime,
    resources: ["https://example.com", "https://phantom.app/"],
  };
  return NextResponse.json(signInData);
}
