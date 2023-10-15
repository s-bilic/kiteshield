"use client";
import React, { useState } from "react";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Transaction from "./transaction";
import { Separator } from "@/components/ui/separator";
import { pythTokens } from "@/lib/tokens";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import Blank from "./blank";

interface IProps {
  tokenList?: [
    {
      address: String;
      symbol: String;
      logoURI: String;
    },
  ];
  insuredData?: {
    data: [
      {
        createdAt: Date;
        updatedAt: Date;
        id: String;
        insured: Boolean;
        price: Number;
        priceHistory: Number;
        received: Number;
        receivedToken: String;
        signature: String;
        spend: Number;
        spendToken: String;
        timestamp: Date;
        userId: Number;
      },
    ];
    error: any;
    isLoading: Boolean;
    isValidating: Boolean;
  };
  session?: {
    user: {
      name: String;
    };
  };
}

const Transactions = ({ tokenList, insuredData, session }: IProps) => {
  const { data } = insuredData;
  const [activeIndex, setActiveIndex] = useState<Number>(null);

  const apiUrl = session ? "api/transactions" : null;

  const {
    data: transactions,
    isLoading,
    error,
  } = useSWR(apiUrl, () => fetcher(apiUrl, "POST", session), {
    revalidateOnFocus: true,
    initialData: [], // Provide the appropriate initial data structure
  });

  const handleTransaction = (index: Number) => {
    setActiveIndex(index);
  };

  const LoadingSkeleton = () => (
    <Card className="flex items-center space-x-4 p-5 justify-between">
      <div className="flex gap-7">
        <div className="flex items-center">
          <div className="flex items-center gap-x-20 mr-2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-x-20 mr-2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-2 w-10" />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-14" />
      </div>
    </Card>
  );
  const filteredTransactions = transactions?.filter(
    (item: { signature: String }) =>
      !data?.find(
        (insuredItem: { signature: String; insured: Boolean }) =>
          insuredItem.signature === item.signature &&
          insuredItem.insured === true,
      ),
  );
  return (
    <div className="w-full my-4 ">
      {isLoading
        ? Array(5)
            .fill()
            ?.map((item, index) => (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Separator decorative={false} className="my-2" />
                )}
                <LoadingSkeleton />
              </React.Fragment>
            ))
        : !filteredTransactions?.length &&
          session && (
            <Blank
              title={"No transactions found"}
              description={"Make a swap on Jupiter (DEX aggregator)"}
              href={"https://jup.ag/"}
              linkText={"Visit Jupiter"}
            />
          )}
      {!isLoading &&
        filteredTransactions?.map(
          (
            item: {
              tokenTransfers: [
                {
                  mint: String;
                  tokenAmount: Number;
                },
                {
                  mint: String;
                  tokenAmount: Number;
                },
              ];
              tokenPrice: {
                price: Number;
              };
              signature: String;
              tokenPriceHistory: {
                price: Number;
              };
            },
            index: Number,
          ) => (
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
                price={item?.tokenPrice?.price}
                signature={item?.signature}
                priceHistory={item?.tokenPriceHistory?.price}
                onClick={() => handleTransaction(index)}
                active={activeIndex === index}
              />
            </React.Fragment>
          ),
        )}
    </div>
  );
};

export default Transactions;
