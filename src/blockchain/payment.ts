import { ethers } from "ethers";
import gatewayAbi from "./abi/gateway.json";
import erc20Abi from "./abi/erc20.json";
import {
  CONTRACT_ADDRESS,
  USDC_ADDRESS,
} from "./config";
import { getSigner } from "./provider";
import { checkNetwork } from "./network";

import { showSuccessToast, showErrorToast } from "../components/ui/custom-toast";

export async function payWithWallet({
  intentId,
  amount,
  onApprove,
  onPending,
  onSuccess,
}: {
  intentId: string;
  amount: string;
  onApprove?: () => void;
  onPending?: (hash: string) => void;
  onSuccess?: (hash: string) => void;
}) {
  try {
    await checkNetwork();

    const signer = await getSigner();

    const gateway = new ethers.Contract(
      CONTRACT_ADDRESS,
      gatewayAbi,
      signer
    );

    const usdc = new ethers.Contract(
      USDC_ADDRESS,
      erc20Abi,
      signer
    );

    const parsedAmount = ethers.parseUnits(
      amount,
      6
    );

    onApprove?.();

    const approveTx = await usdc.approve(
      CONTRACT_ADDRESS,
      parsedAmount
    );

    await approveTx.wait();
    showSuccessToast("Approval successful!");

    const payTx = await gateway.pay(intentId);
    
    onPending?.(payTx.hash);
    
    const receipt = await payTx.wait();
    console.log(receipt);

    onSuccess?.(receipt.hash);

    return {
      success: true,
      txHash: receipt.hash,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }
}