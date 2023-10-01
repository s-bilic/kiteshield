import type { NextApiRequest, NextApiResponse } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { verifySignIn } from "@solana/wallet-standard-util";
import type {
  SolanaSignInInput,
  SolanaSignInOutput,
} from "@solana/wallet-standard-features";
import type { AuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        body: {
          label: "Message",
          type: "object",
        },
      },
      async authorize(credentials, req) {
        try {
          const deconstructPayload: {
            input: SolanaSignInInput;
            output: SolanaSignInOutput;
          } = JSON.parse(credentials?.body);

          // The data for the signing (displayed in phantom pop-up)
          const backendInput = deconstructPayload.input;

          // The output received after the signing
          // NOTE: The output needs to be transformed back to a Uint8Array
          const backendOutput: SolanaSignInOutput = {
            account: {
              ...deconstructPayload.output.account,
              publicKey: Uint8Array.from(
                deconstructPayload.output.account.publicKey,
              ),
            },
            signature: Uint8Array.from(deconstructPayload.output.signature),
            signedMessage: Uint8Array.from(
              deconstructPayload.output.signedMessage,
            ),
          };

          // Verify the output against the input (true/false)
          const verificationResult = verifySignIn(backendInput, backendOutput);

          if (verificationResult) {
            const data = await prisma.user.upsert({
              where: { address: deconstructPayload.output.account?.address },
              update: {
                updatedAt: new Date(),
              },
              create: {
                address: deconstructPayload.output.account?.address,
                createdAt: new Date(),
              },
            });

            // console.log(data);
            return {
              id: deconstructPayload.output.account?.address,
            };
          } else {
            console.log("not verified");
            return;
          }
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // @ts-ignore
      session.publicKey = token.sub;
      if (session.user) {
        session.user.name = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
