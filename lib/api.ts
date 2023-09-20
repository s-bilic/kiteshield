const getTransactions = async (address: string) => {
  const url = `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${process.env.API_KEY_HELIUS}`;
  const response = await fetch(url);
  const data = await response.json();

  return data.slice(0, 5);
};

export { getTransactions };
