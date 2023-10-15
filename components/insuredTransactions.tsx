"use client";

import React, { useState } from "react";
import InsuredTransaction from "./insuredTransaction";
import { Separator } from "@/components/ui/separator";
import useSWR from "swr";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface IProps {
  tokenList?: [];
  data?: [];
  session?: {};
}

const InsuredTransactions = ({ tokenList, insuredData, session }: IProps) => {
  const { data, isLoading, error } = insuredData;
  const [activeIndex, setActiveIndex] = useState(null);
  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  // const fetcher = (url) => fetch(url).then((res) => res.json());

  // const apiUrl = session ? "api/premium" : null;

  // const {
  //   data: insuredData,
  //   isLoading,
  //   error,
  // } = useSWR(apiUrl, () => fetcher(apiUrl), {
  //   revalidateOnFocus: true,
  //   initialData: [], // Provide the appropriate initial data structure
  // });

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
  return (
    <div className="w-full my-4">
      {isLoading &&
        Array(data?.length)
          .fill()
          ?.map((item, index) => (
            <React.Fragment key={index}>
              {index !== 0 && <Separator decorative={false} className="my-2" />}
              <LoadingSkeleton />
            </React.Fragment>
          ))}
      {!isLoading &&
        data?.map((item, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <Separator decorative={false} className="my-2" />}
            {item?.insured && (
              <InsuredTransaction
                policy={item?.Policy[0]}
                logoSpend={
                  tokenList?.find(
                    (token) => token?.address === item?.spendToken,
                  )?.logoURI
                }
                logoReceived={
                  tokenList?.find(
                    (token) => token?.address === item?.receivedToken,
                  )?.logoURI
                }
                nameSpend={
                  tokenList?.find(
                    (token) => token?.address === item?.spendToken,
                  )?.symbol
                }
                nameReceived={
                  tokenList?.find(
                    (token) => token?.address === item?.receivedToken,
                  )?.symbol
                }
                transfer={[2]}
                spend={item?.spend}
                received={item?.received}
                price={item?.price}
                priceHistory={item?.priceHistory}
                signature={item?.signature}
                onClick={() => handleTransaction(index)}
                insured={item?.insured}
                active={activeIndex === index}
                completed={item?.completed}
                updatedAt={item?.updatedAt}
              />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default InsuredTransactions;
