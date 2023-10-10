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
    range: z.enum(["day", "week", "month"], {
      required_error: "Select your range period",
    }),
    signature: z.string()?.optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const formattedNumber = (value: number) => {
    const data = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 3,
    }).format(value);

    return data;
  };

  const claimSolana = async () => {
    setLoading(true);
    const body = {
      signature: signature,
    };

    const response = await fetch("http://localhost:3000/api/claim", {
      method: "POST",
      body: JSON.stringify(body),
    });
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

  console.log(policy?.risk?.range);

  return (
    <Card
      className={
        policy?.completed ? "p-5 border-green-500 " : "p-5 hover:border-white"
      }
      onClick={onClick}
    >
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
                {formattedNumber(received)}{" "}
                {` (${transactionValue.toFixed(2)}$)`}
              </p>
              <p className="text-xs text-muted-foreground ml-2">
                {nameReceived}
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
            <Badge className="bg-white mr-2 w-16 justify-center">
              <p className="text-xs text-slate-900">
                {"$" + priceHistory.toFixed(2)}
              </p>
            </Badge>
          </div>
          <div>
            <p
              className="text-xs text-muted-foreground ml-2"
              style={{ fontSize: "10px" }}
            >
              price
            </p>
            <Badge
              className={
                price > priceHistory
                  ? "bg-lime-500 w-16 justify-center"
                  : price < priceHistory
                  ? "bg-red-500 w-16 justify-center"
                  : "bg-gray-400 w-16 justify-center"
              }
            >
              <p className="text-xs text-slate-900">
                {"$" + price?.toFixed(2)}
              </p>
            </Badge>
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
                      <div className="grid w-full max-w-sm items-center jus gap-2.5">
                        <Label htmlFor="decrease">
                          When the price goes down by
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
                    <input
                      value={signature}
                      type="hidden"
                      {...form.register("signature")}
                    />
                  </div>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Risk factor
                      </CardTitle>
                      <AlertOctagon width={18} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-500">
                        {policy?.risk?.factor}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Associated with this transaction
                      </p>
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
                          ${policy?.claimPrice?.toFixed(4)}
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
    </Card>
  );
};

export default InsuredTransaction;
