"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transactions from "@/components/transactions";
import InsuredTransactions from "@/components/insuredTransactions";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";

interface IProps {
  tokenList?: [];
  insuredData?: [];
}

const Main = ({ tokenList, insuredData }: IProps) => {
  const { data: session } = useSession();
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected && session) {
      signOut({ redirect: false });
      console.log(connected);
    }
  }, [connected]);

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Transactions</TabsTrigger>
        <TabsTrigger value="password">Insured</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Transactions tokenList={tokenList} session={session} />
      </TabsContent>
      <TabsContent value="password">
        <InsuredTransactions
          data={insuredData}
          tokenList={tokenList}
          session={session}
        />
      </TabsContent>
    </Tabs>
  );
};
export default Main;
