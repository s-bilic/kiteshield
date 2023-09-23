"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Slider } from "@/components/ui/slider";

import { Separator } from "@/components/ui/separator";
import {
  PythConnection,
  getPythProgramKeyForCluster,
  PythHttpClient,
} from "@pythnetwork/client";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { useConnection } from "@solana/wallet-adapter-react";
import { pythTokens } from "@/lib/tokens";
import { getTokenPrices } from "@/lib/api";

interface IProps {
  data?: [];
  tokenList?: [];
}

const Transactions = ({ data, tokenList }: IProps) => {
  const [tokenPrices, setTokenPrices] = useState([]);
  const { connection } = useConnection();
  const [activeCards, setActiveCards] = useState<number[]>([]);
  const [sliderValue, setSliderValue] = useState([20]);

  const pythClient = new PythHttpClient(
    connection,
    getPythProgramKeyForCluster("pythtest-crosschain"),
  );

  const fetchTokenPrices = async () => {
    const data = await getTokenPrices(pythClient, pythTokens);
    setTokenPrices(data);
  };

  const handleToggle = (index: number) => {
    // Check if the card is already active, and toggle its state accordingly
    if (activeCards.includes(index)) {
      setActiveCards(activeCards.filter((item) => item !== index));
    } else {
      setActiveCards([...activeCards, index]);
    }
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
          <Card className="p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex justify-between items-center">
                <Image
                  style={{ borderRadius: "100%" }}
                  width={40}
                  height={40}
                  alt={"t"}
                  src={
                    tokenList?.find(
                      (token) =>
                        token?.address === item?.tokenTransfers[0]?.mint,
                    )?.logoURI
                  }
                />
                {"->"}
                <div className="flex items-center">
                  <Image
                    style={{ borderRadius: "100%" }}
                    width={40}
                    height={40}
                    alt={"t"}
                    src={
                      tokenList?.find(
                        (token) =>
                          token?.address === item?.tokenTransfers[1]?.mint,
                      )?.logoURI
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {item?.tokenTransfers[1]?.tokenAmount}
                  </p>
                </div>
              </div>
              <CardDescription>
                {item?.type === "UNKNOWN" ? "Normal transaction" : item?.type}
                <br></br>
                {"$" + item?.price + "(current)"}
                <br></br>
                {"$" + item?.tokenPriceHistory?.price}
              </CardDescription>
              <div className="flex space-x-3">
                <Toggle
                  variant={"outline"}
                  aria-label="Toggle"
                  defaultPressed={activeCards.includes(index)}
                  onClick={() => handleToggle(index)}
                >
                  Details
                </Toggle>
              </div>
            </div>
            {activeCards.includes(index) && (
              <div>
                <Separator decorative={false} border className="my-5" />
                <div className="flex justify-between items-end">
                  <div className="flex justify-between w-full gap-10">
                    <div className="grid w-full w-30 max-w-sm items-center gap-2.5">
                      <Label htmlFor="decrease">If the price drops by</Label>
                      {/* <Slider
                        defaultValue={[sliderValue]}
                        max={100}
                        step={1}
                        onValueChange={(e) => setSliderValue(e[0])}
                      /> */}
                      <p className="text-xs text-muted-foreground">
                        -{sliderValue}%
                      </p>

                      {/* <Input type="number" id="decrease" placeholder="Price" /> */}
                    </div>
                    <div className="grid w-full max-w-sm items-center justify-center gap-2.5">
                      <Label htmlFor="decrease">Within</Label>
                      <Select>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="1 Day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full max-w-sm items-center jus gap-2.5">
                      <Label htmlFor="decrease">I will get back</Label>
                      <p className="text-xs text-muted-foreground">0.02 SOL</p>
                    </div>
                  </div>
                  <Button variant="default">Insure</Button>
                </div>
              </div>
            )}
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Transactions;
