"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Transaction from "./transaction";
import InsuredTransaction from "./insuredTransaction";
import { Separator } from "@/components/ui/separator";
import { useSession, signOut } from "next-auth/react";
interface IProps {
  data?: [];
  tokenList?: [];
}

const InsuredTransactions = ({ data, tokenList }: IProps) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const handleTransaction = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full">
      <Button onClick={() => signOut({ redirect: false })}> Sign out</Button>

      {data?.map((item, index) => (
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
