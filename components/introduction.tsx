import Logo from "./logo";
import Transaction from "./transaction";

const Introduction = () => {
  return (
    <div className="h-[475px] flex-col items-center justify-center">
      <div className="relative h-full flex-col bg-muted p-10 text-white dark:border-r sm:flex rounded-md">
        <div className="absolute inset-0 bg-zinc-900 rounded-md" />
        <div className="z-1  space-y-5 px-10">
          <Transaction
            transfer={[{ tokenAmount: "1000000" }, { tokenAmount: "10" }]}
            logoReceived={
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            }
            logoSpend={
              "https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I?ext=png"
            }
            nameSpend={"BONK"}
            nameReceived={"SOL"}
            price={"21.20"}
            priceHistory={"13.40"}
          ></Transaction>
          <Transaction
            transfer={[{ tokenAmount: "2100" }, { tokenAmount: "10" }]}
            logoReceived={
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            }
            logoSpend={
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
            }
            nameSpend={"USDC"}
            nameReceived={"SOL"}
            price={"21.20"}
            priceHistory={"210"}
          ></Transaction>
        </div>
        <div className="relative z-20 mt-auto flex justify-end text-right">
          <blockquote className="space-y-2">
            <p className="text-lg">
              The easiest way to insure your transactions
            </p>
            <footer className="text-sm">
              Connect your wallet and try it out!
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
export default Introduction;
