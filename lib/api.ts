const getTransactions = async (address: string) => {
  const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.API_KEY_HELIUS}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.slice(0, 5);
};

const getTokenPrices = async (client: any, acceptedTokens: any) => {
  const clientData = await client.getData();

  const d = acceptedTokens?.map((item: any) => ({
    ...item,
    price: clientData?.productPrice.get(item.key)?.price,
  }));

  return d;
};

export { getTransactions, getTokenPrices };
