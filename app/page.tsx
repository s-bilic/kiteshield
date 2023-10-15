import { getTokenList } from "@/lib/api";
import Main from "@/components/main";
// import { AIResponse } from "@/lib/ai";

export default async function Home() {
  const tokenList = await getTokenList();

  // const r = await AIResponse("0%", "-16%", "5%");

  // if (r) {
  //   console.log("xx", JSON.stringify(r));
  // }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Main tokenList={tokenList} />
    </main>
  );
}
