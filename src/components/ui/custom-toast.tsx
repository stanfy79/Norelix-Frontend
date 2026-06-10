import { toast, type Id, type ToastOptions } from "react-toastify";

type ToastVariant = "success" | "error";

type CustomToastProps = {
  message: string;
  variant?: ToastVariant;
  toastId?: Id;
};

export function CustomToast({
  message,
  variant = "success",
  toastId,
}: CustomToastProps) {
  const isError = variant === "error";

  const containerClasses = [
    "flex",
    "items-start",
    "gap-3",
    "min-w-0",
    "pl-4",
    "pr-3",
    "py-3",
    "w-[min(520px,calc(100vw-24px))]",
    "min-h-[55px]",
    "rounded-sm",
    "border",
    isError ? "bg-[#FEE2E2] border-[#F69393]" : "bg-[#DCFCE7] border-[#87D7B7]",
  ].join(" ");

  const textClasses = [
    "text-[12px]",
    isError ? "font-medium leading-[22px]" : "font-normal leading-5",
    "jetbrains-mono",
    "text-[#040217]",
    "flex-1",
    "break-words",
    "max-w-[420px]",
  ].join(" ");

  return (
    <div
      className={containerClasses}
      style={{
        boxShadow:
          "0px 4px 10px -2px rgba(16, 24, 40, 0.08), 0px 10px 20px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="shrink-0 mt-0.5" aria-hidden>
        {isError ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4"
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 16.5h.01"
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 3.5l9 16H3l9-16Z"
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.6666 5L7.49996 14.1667L3.33329 10"
              stroke="#16A34A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div className={textClasses}>{message}</div>
      <button
        aria-label="Close"
        className="flex h-[23px] w-9 items-center justify-center rounded-sm shrink-0 mt-0.5 hover:bg-black/5"
        onClick={() => toast.dismiss(toastId)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="#110F2A"
            strokeWidth="1.33"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

const toastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  closeButton: false,
  icon: false,
  className: "bg-transparent shadow-none p-0 m-0 overflow-visible",
  // bodylassName: "p-0 m-0",
  style: {
    background: "transparent",
    boxShadow: "none",
    width: "auto",
    maxWidth: "none",
    padding: 0,
    overflow: "visible",
  },
};

export const showSuccessToast = (message: string) => {
  const toastId = toast.loading(<CustomToast message={message} variant="success" />, toastOptions);
  toast.update(toastId, {
    ...toastOptions,
    render: <CustomToast message={message} variant="success" toastId={toastId} />,
    type: "success",
    isLoading: false,
  });
  return toastId;
};

export const showErrorToast = (message: string) => {
  const toastId = toast.loading(<CustomToast message={message} variant="error" />, toastOptions);
  toast.update(toastId, {
    ...toastOptions,
    render: <CustomToast message={message} variant="error" toastId={toastId} />,
    type: "error",
    isLoading: false,
  });
  return toastId;
};

// Backwards compatible default
export const showCustomToast = (message: string) => showSuccessToast(message);
