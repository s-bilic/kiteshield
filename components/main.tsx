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
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal, AlertOctagon } from "lucide-react";

interface IProps {
  tokenList?: [
    {
      address: String;
      symbol: String;
      logoURI: String;
    },
  ];
}

type Session = {
  user: {
    name: String;
  };
};

const Main = ({ tokenList }: IProps) => {
  const [activeTab, setActiveTab] = useAtom<String>(activeTabAtom);
  const { toast, dismiss } = useToast();
  const { connecting } = useWallet();
  const { data: session, status } = useSession();
  const apiUrl = session ? "api/premium" : null;

  const insuredData = useSWR(apiUrl, () => fetcher(apiUrl), {
    revalidateOnFocus: true,
    initialData: [],
  });

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
        <div className="flex items-center">
          <Logo />
          <Badge
            className="ml-2 rounded-sm text-black bg-orange-500"
            variant="outline"
          >
            devnet
          </Badge>
        </div>
        <Navigation />
      </div>
      <Tabs
        defaultValue="transactions"
        value={activeTab as string}
        onValueChange={(e: String) => setActiveTab(e)}
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
            session={session as Session}
          />
        </TabsContent>
        <TabsContent value="insured">
          <InsuredTransactions
            tokenList={tokenList}
            insuredData={insuredData}
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
      {session && (
        <Alert className="mb-4">
          <AlertOctagon className="h-4 w-4" />
          <AlertTitle>Attention!</AlertTitle>
          <AlertDescription>
            Your mainnet transactions are shown, but make sure to only use
            solana devnet tokens when paying.
          </AlertDescription>
        </Alert>
      )}
      {!session && <Introduction />}
      <Footer />
    </div>
  );
};
export default Main;
