import Transactions from "@/components/transactions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransactions, getTokenList, getTokenPriceHistory } from "@/lib/api";
import { pythTokens } from "@/lib/tokens";
import { response } from "@/lib/ai";

export default async function Home() {
  // if (response) {
  //   console.log(JSON.stringify(response));
  // }
  const tokenList = await getTokenList();
  const transactions = await getTransactions(
    "ARLQYuL9HEoUtBXpDG26YyvGUAnHJfYbLSstvrm1vS24",
  );

  // The transactions data does not have all the token information we need.
  // That's why we combine transactions + accepted pyth tokens data here.
  const newTransactions = transactions?.map((item) => ({
    ...item,
    token: pythTokens?.find(
      (token) => token?.mint === item?.tokenTransfers[1]?.mint,
    ),
  }));

  // The newTransactions is missing historic price of the token in the transaction
  // Here we put the combine newTransactions + historic token price data here.
  const data = await Promise.all(
    newTransactions?.map(async (item) => {
      const tokenPriceHistory = await getTokenPriceHistory(
        item?.token?.id,
        item.timestamp,
        false,
      );
      return {
        ...item,
        tokenPriceHistory: {
          ...tokenPriceHistory?.parsed[0]?.price,
          price:
            Number(tokenPriceHistory?.parsed[0]?.price?.price) *
            Math.pow(10, tokenPriceHistory?.parsed[0]?.price?.expo),
        },
      };
    }),
  );

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Transactions</TabsTrigger>
          <TabsTrigger value="password">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Transactions data={data} tokenList={tokenList} />
        </TabsContent>
        <TabsContent value="password">n.a.</TabsContent>
      </Tabs>

      {/* <Button variant={"outline"}> Click me</Button> */}
    </main>
  );
}
