"use client";

import React, { useState } from "react";
import InsuredTransaction from "./insuredTransaction";
import { Separator } from "@/components/ui/separator";
import useSWR from "swr";

interface IProps {
  tokenList?: [];
  session?: {};
}

const InsuredTransactions = ({ tokenList, session }: IProps) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const apiUrl = session ? "http://localhost:3000/api/insured" : null;

  const {
    data: insuredData,
    isLoading,
    error,
  } = useSWR(apiUrl, () => fetcher(apiUrl), {
    revalidateOnFocus: true,
    initialData: [], // Provide the appropriate initial data structure
  });

  return (
    <div className="w-full">
      {insuredData?.map((item, index) => (
        <React.Fragment key={index}>
          {index !== 0 && <Separator decorative={false} className="my-2" />}
          {item?.insured && (
            <InsuredTransaction
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
              transfer={[2]}
              spend={item?.spend}
              received={item?.received}
              price={item?.priceNow}
              signature={item?.signature}
              priceHistory={item?.price}
              onClick={() => handleTransaction(index)}
              insured={item?.insured}
              active={activeIndex === index}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default InsuredTransactions;
