import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import PriceChart from "./priceChart";
import Image from "next/image";
import { Card, CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransaction } from "@/actions/actions";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Transaction = ({
  logoSpend,
  logoReceived,
  nameSpend,
  nameReceived,
  price,
  priceHistory,
  active,
  transfer,
  signature,
  spend,
  received,
  onClick,
}) => {
  const [priceDropValue, setPriceDropValue] = useState([20]);
  const [coverValue, setCoverValue] = useState([0]);
  const [riskValue, setRiskValue] = useState({});
  const FormSchema = z.object({
    range: z.enum(["day", "week", "month"], {
      required_error: "Select your range period",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleForm = async (data: z.infer<typeof FormSchema>, event: any) => {
    const body = {
      signature: signature,
      decrease: priceDropValue,
      range: data?.range,
    };

    if (event?.nativeEvent?.submitter?.name === "risk_button") {
      const response = await fetch("http://localhost:3000/api/risk", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const risk = await response.json();

      setRiskValue(risk);
    }

    if (event?.nativeEvent?.submitter?.name === "approve_button") {
      console.log("Inside if block");
      const response = await fetch("http://localhost:3000/api/approve", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const approve = await response.json();
    }
  };

  const formattedNumber = (value: number) => {
    const data = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 3,
    }).format(value);

    return data;
  };

  // also needs on server side
  const transactionValue = priceHistory * transfer[1]?.tokenAmount;
  const insuredValue = (transactionValue * priceDropValue[0]) / 100;
  const insuredTokenValue = insuredValue / priceHistory;

  return (
    <Card
      className="p-5 hover:border-white hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex justify-between items-center">
          <Image
            className="border"
            style={{ borderRadius: "100%", border: "solid 1px white" }}
            width={40}
            height={40}
            alt={"t"}
            src={logoSpend}
          />
          <div>
            <p className="text-s ml-2">
              {formattedNumber(spend ? spend : transfer[0]?.tokenAmount)}
            </p>
            <p className="text-xs text-muted-foreground ml-2">{nameSpend}</p>
          </div>
          <div className="mx-4 border rounded-full p-1">
            <ArrowRight width={14} height={14} />
          </div>
          <div className="flex items-center">
            <Image
              style={{ borderRadius: "100%", border: "solid 1px white" }}
              width={40}
              height={40}
              alt={"t"}
              src={logoReceived}
            />
            <div>
              <p className="text-s ml-2">
                {formattedNumber(
                  received ? received : transfer[1]?.tokenAmount,
                )}
                {` (${transactionValue.toFixed(2)}$)`}
              </p>
              <p className="text-xs text-muted-foreground ml-2">
                {nameReceived}
              </p>
            </div>
          </div>
        </div>
        <CardDescription>
          <Badge className="bg-white mx-2">
            <p className="text-xs text-slate-900">
              {"$" + formattedNumber(priceHistory)}
            </p>
          </Badge>
          <Badge
            className={
              price > priceHistory
                ? "bg-lime-500"
                : price < priceHistory
                ? "bg-red-500"
                : "bg-gray-400"
            }
          >
            <p className="text-xs text-slate-900">
              {"$" + formattedNumber(price)}
            </p>
          </Badge>
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleForm)}
              // action={createTransaction.bind(
              //   null,
              //   signature,
              //   priceDropValue[0],
              // )}
            >
              <Separator decorative={false} border className="my-7" />
              <div className="flex justify-between items-end">
                <div className="flex flex-col w-full gap-5">
                  <div className="grid full-w items-center gap-2.5">
                    <Label className="flex mb-2" htmlFor="decrease">
                      <div className="grid w-full max-w-sm items-center jus gap-2.5">
                        <Label htmlFor="decrease">
                          When the price goes down by
                        </Label>
                        <p className="text-xs text-muted-foreground">{`-${priceDropValue}%`}</p>
                      </div>
                    </Label>
                    <Slider
                      defaultValue={priceDropValue}
                      max={100}
                      step={1}
                      onValueChange={(e) => setPriceDropValue(e)}
                    />
                  </div>
                  <div className="grid w-full gap-2.5">
                    <FormField
                      control={form.control}
                      name="range"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Within a</FormLabel>
                          <FormControl>
                            <RadioGroup
                              name="range"
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-3 gap-4"
                            >
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem
                                    value="day"
                                    id="day"
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <Label
                                  htmlFor="day"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  Day
                                </Label>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem
                                    value="week"
                                    id="week"
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor="week"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  Week
                                </FormLabel>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <RadioGroupItem
                                    value="month"
                                    id="month"
                                    className="peer sr-only"
                                  />
                                </FormControl>
                                <FormLabel
                                  htmlFor="month"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  Month
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid full-w items-center gap-2.5">
                    <div className="grid w-full max-w-sm items-center jus gap-2.5">
                      <Label htmlFor="decrease">Insures me</Label>
                      <p className="text-xs text-muted-foreground">{`${insuredTokenValue.toFixed(
                        4,
                      )} SOL (${insuredValue.toFixed(4)}$) `}</p>
                    </div>
                  </div>
                  <div className="grid full-w items-center gap-2.5">
                    <div className="grid w-full max-w-sm items-center jus gap-2.5">
                      <Label htmlFor="decrease">Costs me</Label>
                      <p className="text-xs text-rose-500">
                        {riskValue?.premiumValue
                          ? `${(riskValue?.premiumTokenValue).toFixed(
                              4,
                            )} SOL (${(riskValue?.premiumValue).toFixed(4)}$) `
                          : `${(insuredTokenValue / 10).toFixed(4)} SOL (${(
                              insuredValue / 10
                            ).toFixed(4)}$) `}
                        <Badge className="bg-white mx-2">
                          <p className="text-xs text-slate-900">
                            {"Risk: " + riskValue?.risk}
                          </p>
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    type="submit"
                    name="risk_button"
                    onClick={handleForm}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculate risk
                  </Button>
                  <div className="flex-col">
                    <Button
                      className={"w-full"}
                      variant="secondary"
                      name="approve_button"
                      type="submit"
                    >
                      Approve
                    </Button>
                    <Button
                      className={"w-full"}
                      variant="destructive"
                      type="submit"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      )}
    </Card>
  );
};

export default Transaction;
