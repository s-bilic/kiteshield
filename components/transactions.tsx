"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Transaction from "./transaction";
import { Separator } from "@/components/ui/separator";
import {
  PythConnection,
  getPythProgramKeyForCluster,
  PythHttpClient,
} from "@pythnetwork/client";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { useConnection } from "@solana/wallet-adapter-react";
import { pythTokens } from "@/lib/tokens";
import { getTokenPrices, getTokenPriceHistory } from "@/lib/api";

interface IProps {
  data?: [];
  tokenList?: [];
}

const Transactions = ({ data, tokenList }: IProps) => {
  const [tokenPrices, setTokenPrices] = useState([]);
  const { connection } = useConnection();
  const [activeIndex, setActiveIndex] = useState(0);

  const pythClient = new PythHttpClient(
    connection,
    getPythProgramKeyForCluster("pythtest-crosschain"),
  );

  const fetchTokenPrices = async () => {
    const data = await getTokenPrices(pythClient, pythTokens);
    setTokenPrices(data);
  };

  // const fetchTokenPriceHistory = async () => {
  //   const d = await getTokenPriceHistory(
  //     "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  //     "prevMonth",
  //     true,
  //   );

  //   console.log(d);

  //   return d;
  // };

  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    fetchTokenPrices();
  }, []);

  const transactionsData = data?.map((item) => ({
    ...item,
    price: tokenPrices
      ?.find((t) => t.mint === item?.token?.mint)
      ?.price.toFixed(3),
  }));

  return (
    <div className="w-full">
      {/* <h2 className="text-2xl font-bold tracking-tight">Latest transactions</h2>
      <Separator decorative={false} className="my-1" />
      <p className="text-xs text-muted-foreground">+201 since last hour</p>
      <Separator decorative={false} className="my-2" /> */}

      {transactionsData?.map((item, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <Separator decorative={false} className="my-2" />}
          <Transaction
            logoSpend={
              tokenList?.find(
                (token) => token?.address === item?.tokenTransfers[0]?.mint,
              )?.logoURI
            }
            logoReceived={
              tokenList?.find(
                (token) => token?.address === item?.tokenTransfers[1]?.mint,
              )?.logoURI
            }
            nameSpend={
              pythTokens?.find(
                (token) => token?.mint === item?.tokenTransfers[0]?.mint,
              )?.name
            }
            nameReceived={
              pythTokens?.find(
                (token) => token?.mint === item?.tokenTransfers[1]?.mint,
              )?.name
            }
            transfer={item?.tokenTransfers}
            token={item?.token}
            type={item?.type}
            price={item?.price}
            priceHistory={item?.tokenPriceHistory?.price}
            onClick={() => handleTransaction(index)}
            active={activeIndex === index}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Transactions;
