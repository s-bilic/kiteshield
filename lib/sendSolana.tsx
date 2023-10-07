import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useCallback, useState } from "react";

const SendSolana = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [signature, setSignature] = useState("");

  const from = publicKey as PublicKey;
  const to = new PublicKey("8V581oTaLYvyUdNwg2ha3ePyv4SDHjAT3tAYQHNcRHUN");

  const init = useCallback(
    async (amount: number) => {
      setProcessing(true);
      setConfirmed(false);
      setSignature("");

      if (!publicKey) throw new WalletNotConnectedError();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from,
          toPubkey: to,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );
      const {
        context: { slot: minContextSlot },
        value: { blockhash, lastValidBlockHeight },
      } = await connection.getLatestBlockhashAndContext();

      const signature = await sendTransaction(transaction, connection, {
        minContextSlot,
      });

      console.log(signature);

      await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
      });
      setProcessing(false);
      setConfirmed(true);
      setSignature(signature);
    },
    [publicKey, sendTransaction, connection],
  );

  return { init, confirmed, processing, signature };
};

export default SendSolana;
