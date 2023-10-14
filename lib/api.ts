const getTokenList = async () => {
  const url = "https://token.jup.ag/strict";

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const getTransactions = async (address: string) => {
  const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.API_KEY_HELIUS}`;
  const response = await fetch(url);
  const data = await response?.json();

  return data?.slice(0, 20);
};

const getTokenPrice = async (address: string) => {
  const url = `https://hermes.pyth.network/api/latest_price_feeds?ids%5B%5D=${address}
  `;
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const getTokenPricesClient = async (client: any, acceptedTokens: any) => {
  const clientData = await client.getData();

  const data = acceptedTokens?.map((item: any) => ({
    ...item,
    price: clientData?.productPrice.get(item.key)?.price,
  }));

  return data;
};

// const timestamp = Math.floor(Date.now() / 1000) - 10;
const getTokenPriceHistory = async (
  id: any,
  timestamp: string,
  onlyPrice: boolean,
) => {
  const date = new Date();
  let targetTimestamp;

  if (timestamp === "prevDay") {
    targetTimestamp = Math.floor(date.setDate(date.getDate() - 1) / 1000);
  } else if (timestamp === "prevWeek") {
    targetTimestamp = Math.floor(date.setDate(date.getDate() - 7) / 1000);
  } else if (timestamp === "prevMonth") {
    targetTimestamp = Math.floor(date.setMonth(date.getMonth() - 1) / 1000);
  } else if (!isNaN(timestamp)) {
    // If a numeric timestamp is provided, use it as is
    targetTimestamp = parseInt(timestamp, 10);
  } else {
    throw new Error("Invalid timestamp value");
  }

  const url = `https://benchmarks.pyth.network/v1/updates/price/${targetTimestamp}?ids=${id}&parsed=true`;

  const response = await fetch(url);
  const data = await response.json();

  if (onlyPrice) {
    const price = data?.parsed[0]?.price?.price;
    const expo = data?.parsed[0]?.price?.expo;
    const formattedPrice = Number(price) * Math.pow(10, expo);

    return formattedPrice;
  } else {
    return data;
  }
};

export {
  getTokenList,
  getTransactions,
  getTokenPrice,
  getTokenPricesClient,
  getTokenPriceHistory,
};
