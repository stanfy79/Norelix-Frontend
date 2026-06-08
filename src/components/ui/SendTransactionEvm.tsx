import { useCallback } from "react";
import { encodeFunctionData, parseEther, parseUnits } from "viem";

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
];

type TokenConfig = {
  type: "native" | "erc20";
  contractAddress?: `0x${string}`;
  decimals?: number;
};

export function useSendTx({
  sendTransactionEvm,
  user,
  ready,
  authenticated,
}: any) {
  return useCallback(
    async (
      to: string,
      amount: number,
      token: TokenConfig,
      chainId: number
    ) => {
      if (!to) throw new Error("Missing recipient");

      const walletAddress = user?.linkedAccounts?.find(
        (a: any) => a.type === "wallet"
      )?.address;

      if (!ready || !authenticated || !walletAddress) {
        throw new Error("Wallet not ready");
      }

      let txParams: any;

      // ---------------------------
      // ETH / Native transfer
      // ---------------------------
      if (token.type === "native") {
        txParams = {
          to,
          value: parseEther(amount.toString()),
          chainId,
        };
      }

      // ---------------------------
      // ERC20 transfer (USDC, etc.)
      // ---------------------------
      if (token.type === "erc20") {
        if (!token.contractAddress || !token.decimals) {
          throw new Error("Missing token config");
        }

        const data = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [
            to,
            parseUnits(amount.toString(), token.decimals),
          ],
        });

        txParams = {
          to: token.contractAddress,
          data,
          chainId,
        };
      }

      const tx = await sendTransactionEvm(txParams, {
        address: walletAddress,
      });

      return typeof tx === "string" ? tx : tx?.hash;
    },
    [sendTransactionEvm, user, ready, authenticated]
  );
}