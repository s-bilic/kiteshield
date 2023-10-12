const pythTokens = [
  {
    id: "ef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
    mint: "So11111111111111111111111111111111111111112",
    name: "SOL",
    key: "Crypto.SOL/USD",
  },
  {
    id: "eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    name: "USDC",
    key: "Crypto.USDC/USD",
  },
  {
    id: "2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    name: "USDT",
    key: "Crypto.USDT/USD",
  },
  {
    id: "5b70af49d639eefe11f20df47a0c0760123291bb5bc55053faf797d1ff905983",
    mint: "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac",
    name: "MNGO",
    key: "Crypto.MNGO/USD",
  },
  {
    id: "72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    name: "BONK",
    key: "Crypto.BONK/USD",
  },
  {
    id: "c80657b7f6f3eac27218d09d5a4e54e47b25768d9f5e10ac15fe2cf900881400",
    mint: "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
    name: "FIDA",
    key: "Crypto.FIDA/USD",
  },
  {
    id: "649fdd7ec08e8e2a20f425729854e90293dcbe2376abc47197a14da6ff339756",
    mint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
    name: "HNT",
    key: "Crypto.HNT/USD",
  },
  {
    id: "67be9f519b95cf24338801051f9a808eff0a578ccb388db73b7f6fe1de019ffb",
    mint: "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
    name: "JITOSOL",
    key: "Crypto.JITOSOL/USD",
  },
  {
    id: "3607bf4d7b78666bd3736c7aacaf2fd2bc56caa8667d3224971ebe3c0623292a",
    mint: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
    name: "MNDE",
    key: "Crypto.MNDE/USD",
  },
  {
    id: "c2289a6a43d2ce91c6f55caec370f4acc38a2ed477f58813334c6d03749ff2a4",
    mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
    name: "MSOL",
    key: "Crypto.MSOL/USD",
  },
  {
    id: "c2289a6a43d2ce91c6f55caec370f4acc38a2ed477f58813334c6d03749ff2a4",
    mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    name: "ORCA",
    key: "Crypto.ORCA/USD",
  },
  {
    id: "91568baa8beb53db23eb3fb7f22c6e8bd303d103919e19733f2bb642d3e7987a",
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    name: "RAY",
    key: "Crypto.RAY/USD",
  },
  {
    id: "49601625e1a342c1f90c3fe6a03ae0251991a1d76e480d2741524c29037be28a",
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "SAMO",
    key: "Crypto.SAMO/USD",
  },
  {
    id: "49601625e1a342c1f90c3fe6a03ae0251991a1d76e480d2741524c29037be28a",
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "SAMO",
    key: "Crypto.SAMO/USD",
  },
  {
    id: "49601625e1a342c1f90c3fe6a03ae0251991a1d76e480d2741524c29037be28a",
    mint: "SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp",
    name: "SLND",
    key: "Crypto.SLND/USD",
  },
  {
    id: "49601625e1a342c1f90c3fe6a03ae0251991a1d76e480d2741524c29037be28a",
    mint: "SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp",
    name: "SLND",
    key: "Crypto.SLND/USD",
  },
  {
    id: "6ed3c7c4427ae2f91707495fc5a891b30795d93dbb3931782ddd77a5d8cb6db7",
    mint: "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1",
    name: "SBR",
    key: "Crypto.SBR/USD",
  },
  {
    id: "681e0eb7acf9a2a3384927684d932560fb6f67c6beb21baa0f110e993b265386",
    mint: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
    name: "ATLAS",
    key: "Crypto.ATLAS/USD",
  },
];

export { pythTokens };
