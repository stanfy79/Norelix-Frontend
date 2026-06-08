import React, { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { Field } from "./FieldInput";
import { showErrorToast, showSuccessToast } from "./custom-toast";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (address: string, amount: number) => Promise<string | void>;
  usdcBalance?: number;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSend,
  usdcBalance = 0,
}) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"details" | "review" | "sending" | "success">("details");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const numericBalance = Number(usdcBalance ?? 0);
  const numericAmount = Number(amount);
  const amountValid = numericAmount > 0 && numericAmount <= numericBalance;
  const addressValid = /^0x[a-fA-F0-9]{40}$/.test(recipient.trim());
  const canReview = addressValid && amountValid;

  const formattedBalance = useMemo(() => {
    return `${numericBalance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })} USDC`;
  }, [numericBalance]);

  const handleReset = () => {
    setRecipient("");
    setAmount("");
    setError(null);
    setTxHash(null);
    setStep("details");
  };

  const close = () => {
    showSuccessToast("Closed Transaction Modal!");
    handleReset();
    onClose();
  };

  const handleReview = () => {
    if (!addressValid) {
      setError("Enter a valid recipient wallet address.");
      return;
    }

    if (!amountValid) {
      setError("Enter a valid amount within your available USDC balance.");
      return;
    }

    setError(null);
    setStep("review");
  };

  const handleSend = async () => {
    setError(null);
    setStep("sending");

    try {
      const hash = await onSend(recipient.trim(), numericAmount);
      setTxHash(hash ?? null);
      setStep("success");
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : "Unable to submit transaction. Please try again."
      );
      setStep("review");
    }
  };

  const handleUseMax = () => {
    setAmount(numericBalance.toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-200/80 backdrop-blur-sm"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full h-screen max-w-2xl overflow-y-auto border border-slate-200 bg-white text-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Send USDC</h2>
            <p className="mt-1 text-sm text-slate-600">Withdraw Funds to an External Wallet.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="text-slate-500 transition hover:text-slate-900"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-4">
              {step === "details" && (
                <>
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="mt-2 text-[13px] leading-6 text-slate-600">
                      Your transfer uses the connected wallet. Confirm the recipient address before submitting.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Field
                      label="Recipient Address"
                      name="recipient"
                      value={recipient}
                      placeholder="0xeeF8855..."
                      onChange={(event) => setRecipient(event.target.value)}
                    />

                    <label className="flex min-w-0 flex-col gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Amount (USDC)
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.000001"
                          value={amount}
                          onChange={(event) => setAmount(event.target.value)}
                          placeholder="0.00"
                          className="min-w-0 flex-1 rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleUseMax}
                          className="rounded-sm bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-slate-700"
                        >
                          Max
                        </button>
                      </div>
                    </label>

                  </div>
                </>
              )}

              {step === "review" && (
                <div className="space-y-5">
                  <div className="border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Recipient</span>
                      <span className="font-mono text-slate-900">{recipient.substring(0, 6)}...{recipient.substring(recipient.length - 6)}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                      <span>Amount</span>
                      <span className="font-semibold text-slate-900">{numericAmount.toLocaleString()} USDC</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                      <span>Network</span>
                      <span className="font-semibold text-slate-900">Arbitrum Sepolia</span>
                    </div>
                  </div>

                  <div className="border border-slate-200 bg-slate-50 p-5">
                    <div className="grid gap-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Remaining balance</span>
                        <span className="font-semibold text-slate-900">{(numericBalance - numericAmount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })} USDC</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Fee</span>
                        <span className="font-semibold text-slate-900">Estimated network fee</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === "sending" && (
                <div className="border border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 border-orange-400 border-2 text-orange-500">
                    <ArrowRight className="animate-pulse" size={24} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">Submitting transfer</h3>
                  <p className="mt-2 text-sm text-slate-600">Sending USDC to the recipient wallet.</p>
                </div>
              )}

              {step === "success" && (
                <div className="border border-slate-200 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-600">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">Transfer sent</h3>
                  <p className="mt-2 text-sm text-slate-600">Your USDC transfer is on its way.</p>
                  {txHash && (
                    <p className="mt-4 break-all text-sm text-slate-700">
                      Tx hash: <span className="font-mono text-slate-900">{txHash}</span>
                    </p>
                  )}
                </div>
              )}

              {/* {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )} */}
            </div>

            <div className="border border-slate-200 bg-slate-50 p-5 text-slate-700">
              <div className="text-sm font-semibold text-slate-900">Summary</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold">Balance:</span>
                  <span>{formattedBalance}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold">Token:</span>
                  <span>USDC</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold">Network:</span>
                  <span>Arbitrum</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          {step === "review" ? (
            <>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 md:w-auto"
              >
                Back to edit
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="w-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 md:w-auto brutal"
              >
                Confirm and send
              </button>
            </>
          ) : step === "success" ? (
            <button
              type="button"
              onClick={close}
              className="w-full rounded-sm bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Close
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReview}
              disabled={!canReview}
              className="w-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 md:w-auto brutal"
            >
              Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
