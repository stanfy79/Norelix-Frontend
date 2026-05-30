import { AlertTriangle, RotateCcw, ShieldCheck, WifiOff, X } from 'lucide-react';
import { useEffect } from 'react';

type ConnectionErrorProps = {
  open: boolean;
  onRetry?: () => void;
  title?: string;
  message?: string;
  network?: string;
  statusCode?: string;
};

export default function ConnectionError({
  open,
  onRetry,
  title = 'Connection interrupted',
  message = 'We could not reach the Norelix payment network. Your funds are safe and no transaction was submitted.',
  network = 'Testnet v1.0',
  statusCode = 'API_TIMEOUT',
}: ConnectionErrorProps) {

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connection-error-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <div className="absolute left-0 top-0 h-1 w-full bg-[#10b981]" />

        <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-red-200 bg-red-50 text-red-500">
              <WifiOff size={20} />
            </span>
            <div>
              <p className="jetbrains-mono text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                Network Alert
              </p>
              <h2 id="connection-error-title" className="mt-1 text-base font-bold text-slate-900">
                {title}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="flex gap-3 rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-red-800">
            <AlertTriangle className="mt-0.5 shrink-0" size={18} />
            <p className="text-sm leading-6">{message}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
              <p className="jetbrains-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Network
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{network}</p>
            </div>
            <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
              <p className="jetbrains-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Status
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{statusCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l-2 border-[#10b981] bg-emerald-50 px-4 py-3 text-[#064e3b]">
            <ShieldCheck size={17} />
            <p className="jetbrains-mono text-[11px] font-bold uppercase tracking-tight">
              Wallet approval remains unchanged
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#10b981] px-4 py-2 text-sm font-bold text-white shadow-[4px_4px_0px_#0d4a36] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!onRetry}
          >
            <RotateCcw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
