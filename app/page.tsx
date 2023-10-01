import Transactions from "@/components/transactions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTokenList } from "@/lib/api";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export default async function Home() {
  // const session = await getServerSession(authOptions);

  // if (response) {
  //   console.log(JSON.stringify(response));
  // }
  const tokenList = await getTokenList();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Transactions</TabsTrigger>
          <TabsTrigger value="password">Insured</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Transactions tokenList={tokenList} />
        </TabsContent>
        <TabsContent value="password">
          <Transactions tokenList={tokenList} insured />
        </TabsContent>
      </Tabs>
    </main>
  );
}
