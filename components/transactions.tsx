"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Transaction from "./transaction";
import { Separator } from "@/components/ui/separator";
import { pythTokens } from "@/lib/tokens";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

interface IProps {
  data?: [];
  tokenList?: [];
}

const Transactions = ({ data, tokenList, insured }: IProps) => {
  const { data: session } = useSession();
  const [t, setT] = useState([]);
  const [insuredTransactions, setInsuredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      body: JSON.stringify(session),
    });
    const data = await response.json();
    setT(data);
    setLoading(false);
  };

  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  const fetchInsuredTransactions = async () => {
    const response = await fetch("http://localhost:3000/api/insured");
    const data = await response.json();
    setInsuredTransactions(data);
    console.log(data);
  };

  useEffect(() => {
    fetchTransactions();

    if (insured) {
      fetchInsuredTransactions();
    }

    if (!session) {
      setT([]);
    }
  }, [session]);

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
      <Button onClick={() => signOut({ redirect: false })}> Sign out</Button>
      {loading &&
        Array(5)
          .fill()
          ?.map((item, index) => (
            <React.Fragment key={index}>
              {index !== 0 && <Separator decorative={false} className="my-2" />}
              <LoadingSkeleton />
            </React.Fragment>
          ))}
      {!loading &&
        !insured &&
        t?.map((item, index) => (
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
      {!loading &&
        insured &&
        insuredTransactions?.map((item, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <Separator decorative={false} className="my-2" />}
            <Transaction
              logoSpend={
                tokenList?.find((token) => token?.address === item?.spendToken)
                  ?.logoURI
              }
              logoReceived={
                tokenList?.find(
                  (token) => token?.address === item?.receivedToken,
                )?.logoURI
              }
              nameSpend={
                tokenList?.find((token) => token?.address === item?.spendToken)
                  ?.symbol
              }
              nameReceived={
                tokenList?.find(
                  (token) => token?.address === item?.receivedToken,
                )?.symbol
              }
              transfer={item?.tokenTransfers}
              spend={item?.spend}
              received={item?.received}
              price={item?.priceNow}
              signature={item?.signature}
              priceHistory={item?.price}
              onClick={() => handleTransaction(index)}
              active={activeIndex === index}
            />
          </React.Fragment>
        ))}
    </div>
  );
};

export default Transactions;
