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

const calculateRiskFactor = (
  dailyPriceChange,
  weeklyPriceChange,
  monthlyPriceChange,
  decrease,
  range,
) => {
  const parsePercentage = (percentage) => {
    return parseFloat(percentage.replace("%", ""));
  };

  dailyPriceChange = parsePercentage(dailyPriceChange);
  weeklyPriceChange = parsePercentage(weeklyPriceChange);
  monthlyPriceChange = parsePercentage(monthlyPriceChange);
  console.log(dailyPriceChange);
  console.log(weeklyPriceChange);
  console.log(monthlyPriceChange);
  let riskFactor = 0;
  let riskLevel = "";
  let reasons = [];

  if (range === 1) {
    if (dailyPriceChange < -5) {
      riskFactor += 0.5;
      reasons.push("Daily price change exceeds -5%.");
    } else if (dailyPriceChange < 0) {
      riskFactor += 0.3;
      reasons.push("Daily price change is negative but not too significant.");
    } else if (dailyPriceChange >= 0) {
      riskFactor += 0.1;
      reasons.push("Daily price change is positive or stable.");
    }
  } else if (range === 7) {
    if (weeklyPriceChange < -10) {
      riskFactor += 0.5;
      reasons.push("Weekly price change exceeds -10%.");
    } else if (weeklyPriceChange < 0) {
      riskFactor += 0.3;
      reasons.push("Weekly price change is negative but not too significant.");
    } else if (weeklyPriceChange >= 0) {
      riskFactor += 0.1;
      reasons.push("Weekly price change is positive or stable.");
    }
  } else if (range === 30) {
    if (monthlyPriceChange < -20) {
      riskFactor += 0.5;
      reasons.push("Monthly price change exceeds -20%.");
    } else if (monthlyPriceChange < 0) {
      riskFactor += 0.3;
      reasons.push("Monthly price change is negative but not too significant.");
    } else if (monthlyPriceChange >= 0) {
      riskFactor += 0.1;
      reasons.push("Monthly price change is positive or stable.");
    }
  } else {
    riskFactor = 0;
    riskLevel = "A";
    reasons.push("Invalid duration provided.");
  }

  if (decrease > 20) {
    riskFactor += 0.5;
    reasons.push("Significant price drop in the transaction.");
  } else if (decrease > 5) {
    riskFactor += 0.3;
    reasons.push("Moderate price drop in the transaction.");
  } else {
    reasons.push("Relatively low price drop in the transaction.");
  }

  if (riskFactor > 0.7) {
    riskLevel = "D";
  } else if (riskFactor > 0.4) {
    riskLevel = "C";
  } else if (riskFactor > 0.1) {
    riskLevel = "B";
  } else {
    riskLevel = "A";
  }

  return {
    factor: riskFactor,
    level: riskLevel,
    reasons: reasons,
  };
};

export {
  cn,
  calculateClaimPrice,
  calculatePriceChange,
  fetcher,
  calculateRiskFactor,
};
