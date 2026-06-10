

export const ToggleRow = ({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex w-full items-center justify-between gap-4 border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-300 hover:bg-white"
  >
    <span className="min-w-0">
      <span className="block text-[13px] font-bold text-slate-900">
        {title}
      </span>
      <span className="mt-1 block text-[11px] leading-5 text-slate-500">
        {description}
      </span>
    </span>
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
        enabled
          ? "border-emerald-500 bg-emerald-500"
          : "border-slate-300 bg-slate-200"
      }`}
      aria-hidden
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </span>
  </button>
);