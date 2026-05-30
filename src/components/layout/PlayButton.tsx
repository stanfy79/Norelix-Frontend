import { useState } from "react";

import { payWithWallet } from "../../blockchain/payment";
import { showSuccessToast, showErrorToast } from "../ui/custom-toast";
import axios from "axios";

declare global {
  interface ImportMetaEnv {
    VITE_BASE_URL: string;
  }
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Props = {
  intentId: string;
  amount: string;
};

export default function PayButton({
  intentId,
  amount,
}: Props) {
  const [status, setStatus] =
    useState("idle");

  const [txHash, setTxHash] =
    useState("");

  async function handlePay() {
    setStatus("preparing");

    const paymentRequest = {
      intentId,
      amount,

      onApprove() {
        setStatus("approving");
      },

      onPending(hash: string) {
        setTxHash(hash);
        setStatus("pending");
      },

      onSuccess(hash: string) {
        setTxHash(hash);
        setStatus("success");
      },

      onError() {
        setStatus("failed");
      }
    } as any;

    const result = await payWithWallet(paymentRequest);
    const updatedStatus = result.success
      ? await axios.post(`${BASE_URL}/api/payment/update`, {
          intentId,
          status: "CONFIRMED",
        })
      : null;
    showSuccessToast("Payment successful. Updated status!");
    console.log("Payment result:", result, "Updated status:", updatedStatus);
    if (!result.success) {
      setStatus("failed");
      showErrorToast("Payment failed. Please try again.");
    }
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={
          status === "approving" ||
          status === "pending"
        }
        className="bg-black text-white p-3"
      >
        {status === "idle" && "Pay"}

        {status === "preparing" &&
          "Preparing..."}

        {status === "approving" &&
          "Approving USDC..."}

        {status === "pending" &&
          "Processing Payment..."}

        {status === "success" &&
          "Payment Successful"}

        {status === "failed" &&
          "Payment Failed. Try Again"}
      </button>

      {txHash && (
        <a
          href={`https://sepolia.arbiscan.io/tx/${txHash}`}
          target="_blank"
        >
          View Transaction
        </a>
      )}
    </div>
  );
}
