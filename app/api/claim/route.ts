import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import idl from "../../../lib/idl.json";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const maxDuration = 60;
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { signature } = await req.json();
  const session = await getServerSession(authOptions);
  const userAddress = session?.user?.name;
  const solanaNetwork = "https://api.devnet.solana.com";
  const connection = new Connection(solanaNetwork);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" });
  }

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

  // Sender's wallet address and private key
  const fromAccount = Keypair.fromSecretKey(
    new Uint8Array(process.env.PRIVATE_WALLET.split(",").map(Number)),
  );
  // Connected user wallet address
  const toAccount = new PublicKey(session?.user?.name as string);

  // Anchor provider setup
  const wallet = new Wallet(fromAccount);
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });
  const program = new Program(idl, idl.metadata.address, provider);

  // Claimable amount (0.01 SOL)
  const lamports = new BN(10000000);

  // Smart contract program
  const sig = await program.methods
    .transferLamports(lamports)
    .accounts({
      from: fromAccount.publicKey,
      to: toAccount,
    })
    .signers([fromAccount])
    .rpc();

  await prisma.policy.update({
    where: {
      id: transaction?.Policy[0]?.id,
    },
    data: {
      completed: true,
      claimSignature: sig,
    },
  });
  // Transaction successful
  return NextResponse.json(sig);
}
