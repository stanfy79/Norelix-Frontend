import { ethers } from "ethers";

const ARBITRUM_SEPOLIA = {
  chainId: "421614", // 421614
  chainName: "Arbitrum Sepolia",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [
    "https://sepolia-rollup.arbitrum.io/rpc",
  ],
  blockExplorerUrls: [
    "https://sepolia.arbiscan.io",
  ],
};

export async function checkNetwork() {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new ethers.BrowserProvider(
    window.ethereum
  );

  const network = await provider.getNetwork();

  if (Number(network.chainId) !== 421614) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: ARBITRUM_SEPOLIA.chainId,
          },
        ],
      });
    } catch (error: any) {
      // chain not added
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ARBITRUM_SEPOLIA],
        });
      } else {
        throw error;
      }
    }
  }
}