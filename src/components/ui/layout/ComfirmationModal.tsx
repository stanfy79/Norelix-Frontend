import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({ reason, isOpen, onClose, onConfirm, itemName }: { reason: string; isOpen: boolean; onClose: () => void; onConfirm: () => void; itemName?: string }) => {
  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm w-full h-full m-auto"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md transform bg-black/80 backdrop-blur-sm p-6 shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-500">
            <AlertTriangle size={30} />
          </div>

          {reason === "logout" ? (
            <h3 className="mb-2 text-xl font-bold text-white">Log Out?</h3>
          ) : (
            <h3 className="mb-2 text-xl font-bold text-white">Delete Account?</h3>
          )}
          <p className="mb-6 text-sm text-slate-300">
            {reason === "logout"
              ? "Are you sure you want to log out of your account?"
              : "Are you sure you want to delete your account? You cannot retrieve it once you delete it!"}
          </p>

          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-[#064e3b] py-3 text-sm font-semibold text-white transition hover:bg-[#065f46] brutal"
            >
              {reason === "logout" ? "Log Out" : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
