import { useState, useTransition } from "react";
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
      className={
        insured
          ? "p-5 hover:border-white border-indigo-500 hover:cursor-pointer"
          : "p-5 hover:border-white hover:cursor-pointer"
      }
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
        </CardDescription>
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
                              defaultValue={field.value}
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
                  <Button variant="secondary" type="submit" name="risk_button">
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

export default InsuredTransaction;
