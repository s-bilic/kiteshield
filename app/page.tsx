import { getTokenList } from "@/lib/api";
import Main from "@/components/main";
// import { AIResponse } from "@/lib/ai";

export default async function Home() {
  // const r = await AIResponse("1,000,000", "3%");
  // if (r) {
  //   console.log("xx", JSON.stringify(r));
  // }
  const response = await fetch("http://localhost:3000/api/insured");
  const insuredData = await response.json();
  const tokenList = await getTokenList();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Main tokenList={tokenList} insuredData={insuredData} />
    </main>
  );
}
