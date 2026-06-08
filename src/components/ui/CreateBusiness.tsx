import React, { useContext, useMemo, useState } from "react";
import { Building2, Globe, WalletCards } from "lucide-react";
import { Field } from "./FieldInput";
import { showErrorToast, showSuccessToast } from "./custom-toast";
import { DataContext } from "../../context/Context";

const CreateBusiness: React.FC = () => {
  const { createBusiness } = useContext(DataContext) as {
    createBusiness: (payload: any) => Promise<any>;
  };
  const [formData, setFormData] = useState({
    businessName: "",
    businessTag: "Digital Services",
    description: "",
    website: "",
    supportEmail: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createdLabel, setCreatedLabel] = useState("");

  const completionScore = useMemo(() => {
    const filled = Object.values(formData).filter(
      (value) => value.trim().length > 0,
    ).length;
    return Math.min(100, Math.round((filled / 5) * 100));
  }, [formData]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.businessName.trim() || !formData.description.trim()) {
      showErrorToast("Business name and description are required to continue.");
      return;
    }

    try {
      setIsCreating(true);
      const payload = {
        businessName: formData.businessName.trim(),
        description: formData.description.trim(),
        businessLogo: "https://static.vecteezy.com/system/resources/thumbnails/004/656/714/small/office-building-glyph-icon-vector.jpg",
        tags: formData.businessTag,
      };
      const response = await createBusiness(payload);

      showSuccessToast(`${response?.message}`);
      setCreatedLabel(formData.businessName.trim());

      window.setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      const apiError = err as {
        response?: { data?: { errors?: string[]; message?: string; error?: string } };
      };
      const errors = apiError?.response?.data?.errors ?? [];
      const message =
        errors.length > 0
          ? errors.join(" • ")
          : apiError?.response?.data?.message ||
            apiError?.response?.data?.error ||
            "An error occurred while creating the business profile. Please try again.";

      showErrorToast(message);
      return;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="w-full rounded-sm border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
            <Building2 size={14} />
            Merchant Setup
          </div>
          <div>
            <h2 className="text-[22px] font-bold text-slate-900 md:text-2xl">
              Create your business
            </h2>
            <p className="mt-2 max-w-xl text-[12px] text-slate-500 md:text-sm">
              Set up the merchant identity, checkout label, and support details
              your payments flow will use.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-1.5">
              <WalletCards size={14} className="text-emerald-600" />
              Ready for wallet payments
            </span>
            <span className="inline-flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-1.5">
              <Globe size={14} className="text-emerald-600" />
              Checkout-ready profile
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-sm border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            Profile completion
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="text-[28px] font-black text-slate-900">
              {completionScore}%
            </span>
            <span className="pb-1 text-[11px] text-slate-500">
              of your merchant profile is ready
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${completionScore}%` }}
            />
          </div>
        </div>
      </div>

      <form
        className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Business name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Norelix Commerce"
          />
          <label className="flex min-w-0 flex-col gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Business tag
            </span>
            <select
              name="businessTag"
              value={formData.businessTag}
              onChange={handleChange}
              className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              {[
                "Tech",
                "Digital Services",
                "Food & Beverage",
                "Consulting",
                "Gaming",
                "Art & NFTs",
                "Events",
                "Other",
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-2 md:col-span-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Checkout description
            </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe how your customers will pay and what they will receive."
              className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </label>
          <Field
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourbrand.com"
          />
          <Field
            label="Support email"
            name="supportEmail"
            value={formData.supportEmail}
            onChange={handleChange}
            placeholder="support@yourbrand.com"
            type="email"
          />
        </div>

        <aside className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-4">
          <div className="rounded-sm border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
              What happens next
            </p>
            <ul className="mt-3 space-y-2 text-[12px] text-slate-600">
              <li>
                • Your merchant profile is prepared for checkout and dashboard
                flows.
              </li>
              <li>
                • The app will surface your business identity across payments
                and settings.
              </li>
              <li>
                • You can update the same details later from the settings panel.
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full rounded-sm bg-[#10b981] px-4 py-3 text-[12px] font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isCreating ? "Creating business..." : "Create business"}
          </button>

          {createdLabel ? (
            <p className="rounded-sm border border-emerald-200 bg-white p-3 text-[12px] text-emerald-700">
              Business profile ready for{" "}
              <span className="font-bold">{createdLabel}</span>.
            </p>
          ) : (
            <p className="text-[11px] text-slate-500">
              Tip: complete the business name and description fields to activate
              the merchant profile.
            </p>
          )}
        </aside>
      </form>
    </section>
  );
};

export default CreateBusiness;
