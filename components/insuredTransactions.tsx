"use client";

import React, { useState } from "react";
import InsuredTransaction from "./insuredTransaction";
import { Separator } from "@/components/ui/separator";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
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
        Policy: [
          {
            id: Number;
            claim: Number;
            claimPrice: Number;
            claimSignature: String;
            completed: Boolean;
            premium: Number;
            premoumSignature: String;
            transactionId: Number;
            userId: Number;
            riskId: Number;
            risk: {
              id: Number;
              createdAt: Date;
              updatedAt: Date;
              dailyPriceChange: String;
              decrease: Number;
              factor: Number;
              level: String;
              monthlyPriceChange: String;
              range: String;
              reasons: String[];
              weeklyPriceChange: String;
            };
          },
        ];
      },
    ];
    error: any;
    isLoading: Boolean;
    isValidating: Boolean;
  };
}

const InsuredTransactions = ({ tokenList, insuredData }: IProps) => {
  const { data, isLoading, error } = insuredData;
  const [activeIndex, setActiveIndex] = useState(null);
  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  console.log(data);

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
        : !data?.length && (
            <Blank
              title={"No insured transactions found"}
              description={"Visit the recent transactions"}
              icon
            />
          )}
      {!isLoading &&
        data?.map(
          (
            item: {
              insured: Boolean;
              policy: [
                {
                  claim: Number;
                  claimPrice: Number;
                  completed: Boolean;
                  risk: {
                    decrease: Number;
                    level: String;
                    range: String;
                    reasons: String[];
                  };
                },
              ];
              logoSpend: String;
              spendToken: String;
              receivedToken: String;
              spend: Number;
              received: Number;
              price: Number;
              priceHistory: Number;
              signature: String;
              updatedAt: String;
            },
            index: Number,
          ) => (
            <React.Fragment key={index}>
              {index !== 0 && <Separator decorative={false} className="my-2" />}
              {item?.insured && (
                <InsuredTransaction
                  policy={item?.Policy[0]}
                  logoSpend={
                    tokenList?.find(
                      (token) => token?.address === item?.spendToken,
                    )?.logoURI as string
                  }
                  logoReceived={
                    tokenList?.find(
                      (token) => token?.address === item?.receivedToken,
                    )?.logoURI as string
                  }
                  nameSpend={
                    tokenList?.find(
                      (token) => token?.address === item?.spendToken,
                    )?.symbol as string
                  }
                  nameReceived={
                    tokenList?.find(
                      (token) => token?.address === item?.receivedToken,
                    )?.symbol as string
                  }
                  spend={item?.spend}
                  received={item?.received}
                  price={item?.price}
                  priceHistory={item?.priceHistory}
                  signature={item?.signature}
                  onClick={() => handleTransaction(index)}
                  insured={item?.insured}
                  active={activeIndex === index}
                  updatedAt={item?.updatedAt}
                />
              )}
            </React.Fragment>
          ),
        )}
    </div>
  );
};

export default InsuredTransactions;
