import { useState, useTransition } from "react";
import {
  AlertOctagon,
  ArrowRight,
  UnlockIcon,
  CalendarClockIcon,
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
}) => {
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

  return (
    <Card
      className={insured ? "p-5 hover:border-white " : "p-5 hover:border-white"}
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
              <p className="text-s ml-2">{formattedNumber(received)}</p>
              <p className="text-xs text-muted-foreground ml-2">
                {nameReceived}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end align-end">
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
                        <p className="text-xs text-muted-foreground">{`-${priceDropValue}%`}</p>
                      </div>
                    </Label>
                    <Slider
                      disabled
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
                          Claim period
                        </p>
                        <p className="text-sm text-muted-foreground">
                          3 days left
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button disabled size={"sm"} variant="secondary">
                    Claim {policy?.claim?.toFixed(4)} SOL
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
