"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Transactions from "@/components/transactions";
import InsuredTransactions from "@/components/insuredTransactions";
import { useSession, signOut } from "next-auth/react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import Introduction from "./introduction";
import { Navigation } from "./navigation";
import Logo from "./logo";
import Footer from "./footer";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
interface IProps {
  tokenList?: [];
}

const Main = ({ tokenList }: IProps) => {
  const { data: session } = useSession();
  const apiUrl = session ? "api/premium" : null;

  const insuredData = useSWR(apiUrl, () => fetcher(apiUrl), {
    revalidateOnFocus: true,
    initialData: [], // Provide the appropriate initial data structure
  });

  return (
    <div className="w-full relative">
      <div className="flex justify-between mb-20">
        <Logo />
        <Navigation />
      </div>
      <Tabs defaultValue="account" className="relative">
        <TabsList>
          <TabsTrigger value="account" disabled={!session}>
            Transactions
          </TabsTrigger>
          <TabsTrigger value="password" disabled={!session}>
            Insured
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Transactions
            tokenList={tokenList}
            insuredData={insuredData}
            session={session}
          />
        </TabsContent>
        <TabsContent value="password">
          <InsuredTransactions
            tokenList={tokenList}
            insuredData={insuredData}
            session={session}
          />
        </TabsContent>
        <div className="absolute top-0 right-0">
          {!session && <WalletMultiButton />}
          {session && (
            <WalletDisconnectButton
              onClick={() => signOut({ redirect: true })}
            />
          )}
        </div>
      </Tabs>
      {!session && <Introduction />}
      <Footer />
    </div>
  );
};
export default Main;
