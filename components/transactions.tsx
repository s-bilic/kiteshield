"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Transaction from "./transaction";
import { Separator } from "@/components/ui/separator";
import { pythTokens } from "@/lib/tokens";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

interface IProps {
  tokenList?: [];
  session?: {};
}
const Transactions = ({ tokenList, session }: IProps) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const fetcher = (url, data) =>
    fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify(session),
    }).then((res) => res.json());

  const {
    data: transactions,
    isLoading,
    error,
  } = useSWR(
    session ? "http://localhost:3000/api/transactions" : null,
    fetcher,
    {
      revalidateOnFocus: true, // This will revalidate the data when the page is focused
      initialData: [], // You can provide initial data here if needed
    },
  );

  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  const LoadingSkeleton = () => (
    <Card className="flex items-center space-x-4 p-5">
      <div className="flex items-center gap-8">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="space-y-2 w-full">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
    </Card>
  );

  return (
    <div className="w-full">
      {isLoading &&
        Array(5)
          .fill()
          ?.map((item, index) => (
            <React.Fragment key={index}>
              {index !== 0 && <Separator decorative={false} className="my-2" />}
              <LoadingSkeleton />
            </React.Fragment>
          ))}
      {!isLoading &&
        transactions?.map((item, index) => (
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
              price={item?.tokenPrice?.price}
              timestamp={item?.timestamp}
              signature={item?.signature}
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
