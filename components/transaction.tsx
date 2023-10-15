import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { AlertOctagon, TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import SendSolana from "@/lib/sendSolana";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSWRConfig } from "swr";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAtom } from "jotai";
import { activeTabAtom } from "../lib/atom";

interface IProps {
  logoSpend?: String;
  logoReceived?: String;
  nameSpend?: String;
  nameReceived?: String;
  price?: Number;
  priceHistory?: Number;
  active?: Boolean;
  transfer?: [
    {
      tokenAmount: Number;
    },
    {
      tokenAmount: Number;
    },
  ];
  signature?: String;
  onClick?: () => void;
}

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
  onClick,
}: IProps) => {
  const [activeTab, setActiveTab] = useAtom<String>(activeTabAtom);
  const { toast, dismiss } = useToast();
  const { mutate } = useSWRConfig();
  const [status, setStatus] = useState("initial");
  const [loading, setLoading] = useState(false);
  const { init, confirmed, signature: premiumSignature } = SendSolana();
  const [priceDropValue, setPriceDropValue] = useState([10]);
  const [riskValue, setRiskValue] = useState({});
  const FormSchema = z.object({
    range: z.enum(["1", "7", "30"], {
      required_error: "Select your range period",
    }),
    signature: z.string()?.optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = form.handleSubmit(
    async (data: z.infer<typeof FormSchema>, event: any) => {
      const body = {
        signature: signature,
        premiumSignature: premiumSignature,
        decrease: priceDropValue,
        range: data?.range,
      };

      if (event?.nativeEvent?.submitter?.name === "risk_button") {
        try {
          setLoading(true);
          setStatus("risk");
          toast({
            title: "Analyzing transaction...",
            description: "This might take a few seconds",
          });
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/risk`,
            {
              method: "POST",
              body: JSON.stringify(body),
            },
          );
          const risk = await response.json();
          dismiss();
          setRiskValue(risk);
          setStatus("approving");
          setLoading(false);
        } catch (e) {
          console.log(e);
          setStatus("risk");
          setLoading(false);
        }
      }

      if (event?.nativeEvent?.submitter?.name === "approve_button") {
        try {
          setLoading(true);
          toast({
            title: "Preparing your payment...",
            description: "This might take a few seconds",
          });
          const approveResponse = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/approve`,
            {
              method: "POST",
              body: JSON.stringify(body),
            },
          );

          await approveResponse.json();
          dismiss();
          toast({
            title: "Confirm payment",
          });
          await init(0.01);
          dismiss();
        } catch (e) {
          console.log(e);
          toast({
            title: "Payment cancelled",
            variant: "destructive",
          });
          setStatus("risk");
          setLoading(false);
        }
      }
    },
  );

  const confirmPayment = async () => {
    const body = {
      premiumSignature: premiumSignature,
      signature: signature,
    };
    try {
      const insureResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/premium`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      await insureResponse.json();
      toast({
        title: "Transaction insured!",
        description: "Added to insured transactions",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => setActiveTab("insured")}
          >
            Show
          </ToastAction>
        ),
      });
      mutate("api/premium");
      setStatus("risk");
      setLoading(false);
    } catch (e) {
      dismiss();
    }
  };

  useEffect(() => {
    if (confirmed) {
      confirmPayment();
    }
  }, [confirmed]);

  const formattedNumber = (
    value: number,
    fraction: number = 2,
    threshold: number = 1e-6,
  ) => {
    if (Math.abs(value) < threshold) {
      return value.toExponential(2);
    }

    const data = Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: fraction,
    }).format(value);

    return data;
  };

  // priceHistory must be replaced with priceType
  const transactionValue =
    Number(priceHistory) * Number(transfer[1]?.tokenAmount);
  const insuredValue = (transactionValue * priceDropValue[0]) / 100;

  const priceType: { value: Number; type: String } =
    price < priceHistory
      ? { value: price, type: "price" }
      : price > priceHistory
      ? { value: priceHistory, type: "priceHistory" }
      : price === priceHistory
      ? null
      : null;

  // TO-DO: Refactor into smaller components
  return (
    <Card className="relative p-5 hover:border-white" onClick={onClick}>
      <TooltipProvider>
        <div className="flex w-full justify-end items-start">
          <div>
            <div className="absolute top-7 -left-10">
              {priceType?.type === "price" ? (
                <Tooltip>
                  <TooltipTrigger>
                    <TrendingDown className="text-rose-500" />
                  </TooltipTrigger>
                  <TooltipContent className="text-center">
                    This transaction is at a loss.<br></br> The current price of
                    the received token is used for insurance.
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <TrendingUp className="text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent className="text-center">
                    This transaction is in profit.<br></br> The price of the
                    received token at the time of transaction will be used.
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex justify-between items-center">
            <Image
              className="border"
              style={{ borderRadius: "100%", border: "solid 1px white" }}
              width={40}
              height={40}
              alt={"t"}
              src={logoSpend as string}
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
                style={{ borderRadius: "100%", border: "solid 1px white" }}
                width={40}
                height={40}
                alt={"t"}
                src={logoReceived as string}
              />
              <div>
                <p className="text-s ml-2">
                  {formattedNumber(transfer[1]?.tokenAmount)}
                  {` ($${transactionValue.toFixed(2)})`}
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
              <form onSubmit={onSubmit}>
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
                            drops to {"->"}
                            {` $${formattedNumber(
                              priceType?.value -
                                (priceDropValue / 100) * priceType?.value,
                              nameReceived === "USDC" ? 6 : 2,
                            )}`}
                          </Label>
                          <p className="text-xs text-muted-foreground">{`-${priceDropValue}%`}</p>
                        </div>
                      </Label>
                      <Slider
                        className="hover:cursor-pointer"
                        defaultValue={priceDropValue}
                        max={100}
                        step={1}
                        onValueChange={(e) => setPriceDropValue(e)}
                        disabled={status === "approving"}
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
                                disabled={status === "approving"}
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
                    <div className="flex justify-between items-start">
                      <div className="grid full-w items-center gap-2.5">
                        <div className="grid w-full max-w-sm items-center jus gap-2.5">
                          <Label htmlFor="decrease">Insures me</Label>
                          <p className="text-xs text-muted-foreground">{`$${insuredValue.toFixed(
                            4,
                          )} out of $${transactionValue.toFixed(4)}`}</p>
                        </div>
                      </div>
                      <div className="grid full-w items-center gap-2.5 text-right">
                        <div className="grid w-full max-w-sm items-center jus gap-2.5">
                          <Label htmlFor="decrease">Costs me</Label>
                          <p className="text-xs text-muted-foreground">
                            {status === "approving" &&
                              `$${(insuredValue / 10).toFixed(4)} (base) +  $${(
                                (insuredValue / 10) *
                                riskValue?.risk?.factor
                              ).toFixed(4)} (risk)`}
                          </p>
                          <div className="border-b"></div>
                          <p className="text-xs text-rose-500">
                            {status === "approving"
                              ? riskValue?.premiumValue
                                ? `$${(riskValue?.premiumValue).toFixed(4)}`
                                : `$${(insuredValue / 10).toFixed(4)}`
                              : "---"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {status === "approving" && (
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
                              {riskValue?.risk?.level}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Associated with this transaction
                            </p>
                          </div>
                          <div className="items-end justify-end">
                            {riskValue?.risk?.reasons?.map((item, index) => (
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
                    )}
                    {(status === "initial" || status === "risk") && (
                      <Button
                        variant="secondary"
                        type="submit"
                        name="risk_button"
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Calculate risk
                      </Button>
                    )}
                    {status === "approving" && (
                      <div className="flex-col space-y-2">
                        <Button
                          className={"w-full"}
                          variant="secondary"
                          name="approve_button"
                          type="submit"
                          disabled={loading}
                        >
                          {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Approve
                        </Button>
                        <Button
                          className={"w-full"}
                          variant="destructive"
                          type="submit"
                          onClick={() => setStatus("risk")}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
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

export default Transaction;
