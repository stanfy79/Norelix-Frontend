import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function getSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const provider = new ethers.BrowserProvider(
    window.ethereum
  );

  return provider.getSigner();
}