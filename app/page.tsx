import Transactions from "@/components/transactions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransactions } from "@/lib/api";

export default async function Home() {
  const dataTransactions = await getTransactions(
    "ARLQYuL9HEoUtBXpDG26YyvGUAnHJfYbLSstvrm1vS24",
  );

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Transactions</TabsTrigger>
          <TabsTrigger value="password">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Transactions data={dataTransactions} />
        </TabsContent>
        <TabsContent value="password">n.a.</TabsContent>
      </Tabs>

      {/* <Button variant={"outline"}> Click me</Button> */}
    </main>
  );
}
