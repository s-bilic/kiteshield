import { useState, useTransition } from "react";
import {
  AlertOctagon,
  ArrowRight,
  UnlockIcon,
  CalendarClockIcon,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import PriceChart from "./priceChart";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Countdown from "react-countdown";
import { useSWRConfig } from "swr";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const InsuredTransaction = ({
  policy,
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
  insured,
  onClick,
  updatedAt,
  completed,
}) => {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const [priceDropValue, setPriceDropValue] = useState([20]);
  const FormSchema = z.object({
    range: z.enum(["1", "7", "30"], {
      required_error: "Select your range period",
    }),
    signature: z.string()?.optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const formattedNumber = (
    value: number,
    fraction: number = 2,
    threshold: number = 1e-6,
  ) => {
    if (Math.abs(value) < threshold) {
      // If the number is smaller than the threshold, format it in scientific notation with limited precision.
      return value.toExponential(2);
    }

    // Format the number using compact notation and the desired precision.
    const data = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: fraction,
    }).format(value);

    return data;
  };

  const claimSolana = async () => {
    setLoading(true);
    const body = {
      signature: signature,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/claim`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    mutate("api/premium");
    setLoading(false);
    console.log(response);
  };

  //price type instead of priceHistory
  const transactionValue = priceHistory * received;
  const insuredValue = (transactionValue * priceDropValue[0]) / 100;
  const insuredTokenValue = insuredValue / priceHistory;

  const claimValue = price * policy?.claim?.toFixed(4);
  // Given start time
  const startTime = new Date(updatedAt);

  // Calculate the end time, 7 days from the start time
  const endTime = new Date(startTime);
  endTime.setDate(startTime.getDate() + Number(policy?.risk?.range));
  // Calculate the time remaining in milliseconds
  const timeRemaining = endTime - Date.now();

  const priceType =
    price < priceHistory
      ? { value: price, type: "price" }
      : price > priceHistory
      ? { value: priceHistory, type: "priceHistory" }
      : price === priceHistory
      ? null
      : null;

  return (
    <Card
      className={
        policy?.completed ? "p-5 border-green-500 " : "p-5 hover:border-white"
      }
      onClick={onClick}
    >
      <TooltipProvider>
        <div className="flex w-full items-center justify-between">
          {policy?.completed && (
            <ShieldCheck
              className={`absolute -left-10 ${
                policy?.completed ? "text-green-500" : ""
              }`}
            />
          )}
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
              <p className="text-s ml-2">{formattedNumber(spend)}</p>
              <p className="text-xs text-muted-foreground ml-2">
                {nameSpend.toUpperCase()}
              </p>
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
                  {formattedNumber(received)}{" "}
                  {` ($${transactionValue.toFixed(2)})`}
                </p>
                <p className="text-xs text-muted-foreground ml-2">
                  {nameReceived.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex">
            <div>
              <p
                className="text-xs text-muted-foreground ml-2"
                style={{ fontSize: "10px" }}
              >
                price (tx)
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className={`bg-white mr-2 w-18 justify-center rounded-md ${
                      priceType?.type === "price"
                        ? ""
                        : "border-blue-500 border-4"
                    }`}
                  >
                    <p className="text-xs text-slate-900">
                      {"$" +
                        formattedNumber(
                          priceHistory,
                          nameReceived === "USDC" ? 6 : 2,
                        )}
                    </p>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    The price of the received token at the time of transaction
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div>
              <p
                className="text-xs text-muted-foreground ml-2"
                style={{ fontSize: "10px" }}
              >
                price
              </p>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className={`w-18 justfify-center rounded-md
                      ${
                        priceType?.type === "price"
                          ? "bg-rose-500"
                          : "bg-green-500"
                      }
                    `}
                  >
                    <p className="text-xs text-slate-900">
                      {"$" +
                        formattedNumber(price, nameReceived === "USDC" ? 6 : 2)}
                    </p>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>The current price of the received token</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        {active && (
          <div>
            <Form {...form}>
              <form>
                <Separator decorative={false} border className="my-7" />
                <div className="flex justify-between items-end">
                  <div className="flex flex-col w-full gap-5">
                    <div className="grid full-w items-center gap-2.5">
                      <Label className="flex mb-2" htmlFor="decrease">
                        <div className="grid w-full items-center jus gap-2.5">
                          <Label htmlFor="decrease">
                            When{" "}
                            <Badge className="text-black mx-1 justify-top px-2 rounded-md">
                              {nameReceived}
                            </Badge>{" "}
                            {`${
                              priceType?.type === "price" ? "price" : "price "
                            }`}
                            {"  "}
                            drops to {"-> "}${policy?.claimPrice?.toFixed(4)}
                          </Label>
                          <p className="text-xs text-muted-foreground">{`-${policy?.risk?.decrease}%`}</p>
                        </div>
                      </Label>
                      <Slider
                        disabled
                        defaultValue={[policy?.risk?.decrease]}
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
                                defaultValue={policy?.risk?.range}
                                value={policy?.name}
                                className="grid grid-cols-3 gap-4"
                                disabled
                              >
                                <FormItem>
                                  <FormControl>
                                    <RadioGroupItem
                                      value="1"
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
                                      value="7"
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
                                      value="30"
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
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Risk factor
                        </CardTitle>
                        <AlertOctagon width={18} />
                      </CardHeader>
                      <CardContent className="flex justify-between items-end">
                        <div>
                          <div className="text-2xl font-bold text-orange-500">
                            {policy?.risk?.level}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Associated with this transaction
                          </p>
                        </div>
                        <div className="items-end justify-end">
                          {policy?.risk?.reasons?.map((item, index) => (
                            <p
                              key={index}
                              className="text-sm text-muted-foreground"
                            >
                              - {item}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex space-x-8">
                      <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <UnlockIcon />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Claim price
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {"$" +
                              formattedNumber(
                                policy?.claimPrice,
                                nameReceived === "USDC" ? 6 : 2,
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                        <CalendarClockIcon />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Expiration time
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {policy?.completed ? (
                              "-"
                            ) : (
                              <Countdown date={Date.now() + timeRemaining} />
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      size={"sm"}
                      variant="secondary"
                      onClick={claimSolana}
                      type={"button"}
                      disabled={policy?.completed}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Claim ${claimValue?.toFixed(2)}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}
      </TooltipProvider>
    </Card>
  );
};

export default InsuredTransaction;
