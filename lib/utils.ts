import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const calculateClaimPrice = (price: number, decrease: number) => {
  return price - (price * decrease) / 100;
};

function calculatePriceChange(currentPrice, previousPrice) {
  if (previousPrice === 0) {
    return "N/A"; // Avoid division by zero
  }

  const percentageChange =
    ((currentPrice - previousPrice) / previousPrice) * 100;

  if (percentageChange > 0) {
    return `+${percentageChange.toFixed(2)}%`; // Positive change
  } else if (percentageChange < 0) {
    return `${percentageChange.toFixed(2)}%`; // Negative change
  } else {
    return "0.00%"; // No change
  }
}

export { cn, calculateClaimPrice, calculatePriceChange };
