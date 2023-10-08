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

const fetcher = async (url, method = "GET", data = null, headers = {}) => {
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Fetch Error: ${error.message}`);
  }
};

export { cn, calculateClaimPrice, calculatePriceChange, fetcher };
