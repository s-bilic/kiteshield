const getTokenList = async () => {
  const url = "https://token.jup.ag/strict";

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const getTransactions = async (address: string) => {
  const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.API_KEY_HELIUS}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.slice(0, 5);
};

const getTokenPrices = async (client: any, acceptedTokens: any) => {
  const clientData = await client.getData();

  const data = acceptedTokens?.map((item: any) => ({
    ...item,
    price: clientData?.productPrice.get(item.key)?.price,
  }));

  return data;
};

const getTokenPricesHistory = async (id: any, timestamp: any) => {
  const url = `https://benchmarks.pyth.network/v1/updates/price/${timestamp}?ids=${id}&parsed=true
  `;
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

export { getTokenList, getTransactions, getTokenPrices, getTokenPricesHistory };
