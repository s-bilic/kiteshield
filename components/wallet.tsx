"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { type SolanaSignInInput } from "@solana/wallet-standard-features";
import { signIn } from "next-auth/react";
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

interface IProps {
  children?: React.ReactNode;
}

const Wallet = ({ children }: IProps) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network],
  );

  const autoSignIn = useCallback(async (adapter: Adapter) => {
    // If the signIn feature is not available, return true
    if (!("signIn" in adapter)) return true;

    // Fetch the signInInput from the backend
    const createResponse = await fetch("api/sign");
    const input: SolanaSignInInput = await createResponse.json();

    // Send the signInInput to the wallet and trigger a sign-in request
    const output = await adapter.signIn(input);

    // Verify the sign-in output against the generated input server-side
    // NOTE: The output needs to be formatted with Array before sending to server side
    let strPayload = JSON.stringify({
      input,
      output: {
        account: {
          address: output.account.address,
          publicKey: Array.from(output.account.publicKey),
        },
        signature: Array.from(output["signature"]),
        signedMessage: Array.from(output["signedMessage"]),
      },
    });

    const success = await signIn("credentials", {
      body: strPayload,
      redirect: false,
    });

    // console.log(success);
    // If verification fails, throw an error
    if (!success) throw new Error("Sign In verification failed!");

    return false;
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoSignIn}>
        <WalletModalProvider>
          <WalletMultiButton />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Wallet;
