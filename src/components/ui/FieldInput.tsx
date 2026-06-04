export const Field = ({
  label,
  value,
  name,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  name: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <label className="flex min-w-0 flex-col gap-2">
    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </span>
    <input
      name={name}
      type={type}
      value={value}
      {...(name === "role" || name === "email" ? { disabled: true } : {})}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
    />
  </label>
);