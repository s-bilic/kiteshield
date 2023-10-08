"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transactions from "@/components/transactions";
import InsuredTransactions from "@/components/insuredTransactions";
import { useSession, signOut } from "next-auth/react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

interface IProps {
  tokenList?: [];
}

const Main = ({ tokenList }: IProps) => {
  const { data: session } = useSession();

  return (
    <Tabs defaultValue="account" className="w-full relative">
      <TabsList>
        <TabsTrigger value="account">Transactions</TabsTrigger>
        <TabsTrigger value="password">Insured</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Transactions tokenList={tokenList} session={session} />
      </TabsContent>
      <TabsContent value="password">
        <InsuredTransactions tokenList={tokenList} session={session} />
      </TabsContent>
      <div className="absolute top-0 right-0">
        {!session && <WalletMultiButton />}
        {session && (
          <WalletDisconnectButton onClick={() => signOut({ redirect: true })} />
        )}
      </div>
    </Tabs>
  );
};
export default Main;
