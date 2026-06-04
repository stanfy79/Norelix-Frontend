export const SettingPanel = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-400/20 text-[#047857]">
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
          <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </section>
);