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
import { useAtom } from "jotai";
import { activeTabAtom } from "../lib/atom";

interface IProps {
  tokenList?: [];
}
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const Main = ({ tokenList }: IProps) => {
  const [activeTab, setActiveTab] = useAtom<String>(activeTabAtom);
  const { toast, dismiss } = useToast();
  const { connecting } = useWallet();
  const { data: session, status } = useSession();
  const apiUrl = session ? "api/premium" : null;

  const insuredData = useSWR(apiUrl, () => fetcher(apiUrl), {
    revalidateOnFocus: true,
    initialData: [], // Provide the appropriate initial data structure
  });
  console.log(status, "s");
  console.log(connecting, "c");
  useEffect(() => {
    if (connecting && status === "unauthenticated") {
      toast({ title: "Signing in..." });
    } else {
      dismiss();
    }
  }, [connecting]);

  return (
    <div className="w-full relative">
      <div className="flex justify-between mb-20">
        <Logo />
        <Navigation />
      </div>
      <Tabs
        defaultValue="transactions"
        value={activeTab as string}
        onValueChange={(e) => setActiveTab(e)}
        className="relative"
      >
        <TabsList>
          <TabsTrigger value="transactions" disabled={!session}>
            Transactions
          </TabsTrigger>
          <TabsTrigger value="insured" disabled={!session}>
            Insured
          </TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Transactions
            tokenList={tokenList}
            insuredData={insuredData}
            session={session}
          />
        </TabsContent>
        <TabsContent value="insured">
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
