// src/services/blockchain/provider.ts
import { ethers } from 'ethers';

export const getProvider = () => {
  return new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
};

export const getSigner = () => {
  // Get signer from Privy or wallet
  return {} as ethers.Signer;
};