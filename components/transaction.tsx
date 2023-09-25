import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PriceChart from "./priceChart";
import Image from "next/image";
import { Card, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { Slider } from "./ui/slider";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";

const Transaction = ({
  logoSpend,
  logoReceived,
  nameSpend,
  nameReceived,
  type,
  price,
  token,
  priceHistory,
  active,
  transfer,
  onClick,
}) => {
  const [sliderValue, setSliderValue] = useState([20]);

  const formattedNumber = (value: number) => {
    const data = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 3,
    }).format(value);

    return data;
  };

  return (
    <Card
      className="p-5 hover:border-slate-500 hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex justify-between items-center">
          <Image
            className="border"
            style={{ borderRadius: "100%" }}
            width={40}
            height={40}
            alt={"t"}
            src={logoSpend}
          />
          <div>
            <p className="text-s ml-2">
              {formattedNumber(transfer[0]?.tokenAmount)}
            </p>
            <p className="text-xs text-muted-foreground ml-2">{nameSpend}</p>
          </div>
          <div className="mx-4 border rounded-full p-1">
            <ArrowRight width={14} height={14} />
          </div>
          <div className="flex items-center">
            <Image
              style={{ borderRadius: "100%" }}
              width={40}
              height={40}
              alt={"t"}
              src={logoReceived}
            />
            <div>
              <p className="text-s ml-2">
                {formattedNumber(transfer[1]?.tokenAmount)}
              </p>
              <p className="text-xs text-muted-foreground ml-2">
                {nameReceived}
              </p>
            </div>
          </div>
        </div>
        <CardDescription>
          <Badge variant="outline">{"$" + formattedNumber(priceHistory)}</Badge>
          {/* <br></br>
          {"$" + price + "(current)"}
          <br></br>
          {"$" + priceHistory} */}
          {/* <PriceChart
            points={[
              [12.40342549423265, 12.40342549423265],
              [12.40342549423265, 12.60342549423265],
            ]}
          /> */}
        </CardDescription>
      </div>
      {active && (
        <div>
          <Separator decorative={false} border className="my-5" />
          <div className="flex justify-between items-end">
            <div className="flex flex-col w-full gap-5">
              <div className="grid full-w max-w-sm items-center gap-2.5">
                <Label className="flex" htmlFor="decrease">
                  If the price drops:
                  <p className="text-xs text-muted-foreground">
                    &nbsp;-{sliderValue}%
                  </p>
                </Label>
                <Slider
                  defaultValue={[sliderValue]}
                  max={100}
                  step={1}
                  onValueChange={(e) => setSliderValue(e[0])}
                />

                {/* <Input type="number" id="decrease" placeholder="Price" /> */}
              </div>
              <div className="grid w-full max-w-sm gap-2.5">
                <Label htmlFor="decrease">Within</Label>
                <RadioGroup
                  defaultValue="card"
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Day
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="paypal"
                      id="paypal"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="paypal"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Week
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="apple"
                      id="apple"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="apple"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      Month
                    </Label>
                  </div>
                </RadioGroup>
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
  );
};

export default Transaction;
