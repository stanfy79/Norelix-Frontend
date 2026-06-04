import { usePrivy } from "@privy-io/react-auth";
import React, { useContext, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  Check,
  Files,
  LockKeyhole,
  LogOut,
  Mail,
  RefreshCcw,
  SlidersHorizontal,
  Smartphone,
  Trash,
  Upload,
  User,
  Wallet,
} from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { DataContext } from "../../context/Context";
import {
  showErrorToast,
  showSuccessToast,
} from "../../components/ui/custom-toast";
import { Skeleton } from "../../components/ui/skeleton";
import { Link } from "react-router-dom";
import ConfirmationModal from "../../components/ui/layout/ComfirmationModal";
import { ToggleRow } from "../../components/ui/ToggleBtn";
import { SettingPanel } from "../../components/ui/SettingPanel";
import { Field } from "../../components/ui/FieldInput";
import Footer from "../../components/common/Footer";

type BusinessData = {
  businessId?: string;
  businessLogo?: string;
  businessName?: string;
  businessTag?: string;
  description?: string;
  apiKey?: string;
};

type AccountSettings = {
  fullName: string;
  email: string;
  role: string;
};

type BusinessSettings = {
  businessName: string;
  businessTag: string;
  description: string;
  statementDescriptor: string;
};

type NotificationSettings = {
  paymentSuccess: boolean;
  paymentFailed: boolean;
  webhookIssues: boolean;
  weeklySummary: boolean;
};

type SecuritySettings = {
  requireWalletConfirmation: boolean;
  allowTestnetOnly: boolean;
  sessionAlerts: boolean;
};

type DeveloperSettings = {
  defaultNetwork: string;
  webhookRetries: string;
};

const getUserEmail = (user: unknown) => {
  const privyUser = user as {
    email?: { address?: string };
    google?: { email?: string };
    github?: { email?: string };
  } | null;

  return (
    privyUser?.email?.address ||
    privyUser?.google?.email ||
    privyUser?.github?.email ||
    ""
  );
};

const shortenValue = (value?: string, visible = 6) => {
  if (!value) return "Not connected";
  if (value.length <= visible * 2) return value;
  return `${value.slice(0, visible)}...${value.slice(-visible)}`;
};

const Settings: React.FC = () => {
  const { ready, authenticated, logout, user } = usePrivy();
  const [activeTab, setActiveTab] = useState<string>("Settings");

  const { businessData, apiLoading, getBusinessAnalytics, updateBusinessSettings, deleteBusiness, createNewSecretkey } = useContext(
    DataContext,
  ) as {
    businessData: BusinessData | null;
    getBusinessAnalytics: () => void;
    deleteBusiness: () => void;
    createNewSecretkey: () => void;
    apiLoading?: {
      business: boolean;
      analytics: boolean;
      txHistory: boolean;
    };
    updateBusinessSettings?: (updates: {
      businessName: string;
      businessTag: string;
      description: string;
      statementDescriptor: string;
      businessLogo?: string;
      logoFile?: File | null;
      accountSettings?: AccountSettings;
      notificationSettings?: NotificationSettings;
      securitySettings?: SecuritySettings;
      developerSettings?: DeveloperSettings;
    }) => Promise<unknown>;
  };

  React.useEffect(() => {
    if (ready) {
      getBusinessAnalytics();
    }
  }, [businessData]);

  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const walletAddress = user?.wallet?.address;
  const isBusinessLoading = Boolean(apiLoading?.business);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalReason, setModalReason] = useState<"logout" | "delete">("logout");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(
    businessData?.businessLogo ?? "",
  );

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    fullName: userEmail ? userEmail.split("@")[0] : "Merchant Admin",
    email: userEmail,
    role: "Owner",
  });

  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: businessData?.businessName ?? "Norelix Merchant",
    businessTag: businessData?.businessTag ?? "crypto-payments",
    description:
      businessData?.description ??
      "On-chain payment collection, settlement, and checkout operations.",
    statementDescriptor: businessData?.businessName ?? "NORELIX PAY",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    paymentSuccess: true,
    paymentFailed: true,
    webhookIssues: true,
    weeklySummary: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    requireWalletConfirmation: true,
    allowTestnetOnly: true,
    sessionAlerts: true,
  });

  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(
    {
      defaultNetwork: "Arbitrum Sepolia",
      webhookRetries: "3",
    },
  );

  React.useEffect(() => {
    if (userEmail) {
      setAccountSettings((prev) => ({
        ...prev,
        email: prev.email || userEmail,
      }));
    }
  }, [userEmail]);

  React.useEffect(() => {
    if (businessData?.businessId) {
      setBusinessSettings((prev) => ({
        ...prev,
        businessName: businessData.businessName || prev.businessName,
        businessTag: businessData.businessTag || prev.businessTag,
        description: businessData.description || prev.description,
        statementDescriptor:
          businessData.businessName || prev.statementDescriptor,
      }));
      setLogoPreview(businessData.businessLogo || "");
    }
  }, [businessData]);

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccountSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusinessChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setBusinessSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showErrorToast("Please upload a valid image file.");
      event.target.value = "";
      return;
    }

    setLogoFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const saveSettings = async () => {
    if (!updateBusinessSettings) {
      showErrorToast("Settings provider is not available yet.");
      return;
    }

    setIsSaving(true);

    try {
      await updateBusinessSettings({
        ...businessSettings,
        businessLogo: logoPreview,
        logoFile,
        accountSettings,
        notificationSettings: notifications,
        securitySettings: security,
        developerSettings,
      });
      showSuccessToast("Settings saved successfully.");
    } catch (error) {
      console.error("Error saving settings:", error);
      showErrorToast("Unable to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const logOut = () => {
    setModalReason("logout");
    setIsModalOpen(true);
  };

  const deleteAccount = () => {
    setModalReason("delete");
    setIsModalOpen(true);
  };

  const confirmLogOut = () => {
    setIsModalOpen(false);
    logout();
  };
  const confirmDeleteAccount = () => {
    setIsModalOpen(false);
    deleteBusiness();
  };


  return (
    <div className="flex flex-col overflow-hidden bg-[#b37850]">
      <div className="flex flex-1 overflow-hidden">
        <ConfirmationModal
          reason={modalReason}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={
            modalReason === "logout" ? confirmLogOut : confirmDeleteAccount
          }
        />

        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mt-16 md:mt-0 p-6 w-full space-y-12 jetbrains-mono overflow-y-auto h-screen no-scrollbar">
          <div className="mb-8 flex flex-wrap-reverse items-center justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-bold text-slate-900 md:text-2xl">
                Settings
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[12px] uppercase text-slate-600">
                  Merchant controls and account preferences
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 fixed right-6 top-16 md:top-6">
              <button
                type="button"
                onClick={saveSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-sm bg-[#10b981] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-emerald-700 brutal disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <Check size={16} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-white px-4 py-2 text-[12px] font-bold text-slate-700 transition hover:border-slate-500"
              >
                <RefreshCcw size={16} />
                Refresh
              </button>
            </div>
          </div>

          <section>
            <div className="">
              {isBusinessLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-44" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-bold">{businessData?.businessName}</h2>
                  <div className="flex flex-wrap gap-2 text-[12px] py-2 items-center font-semibold">
                    <span>Business ID</span>
                    <div className="flex flex-nowrap items-center gap-x-2">
                      <span className="bg-slate-200 border-2 border-slate-200/50 px-[8px] text-slate-600 rounded-md">
                        {businessData?.businessId}
                      </span>
                      <span
                        className="text-slate-500 hover:text-slate-800 cursor-pointer"
                        onClick={() => {
                          const businessId = businessData?.businessId;
                          if (!businessId) return;
                          navigator.clipboard.writeText(businessId);
                          showSuccessToast("Business ID copied to clipboard!");
                        }}
                      >
                        <Files size={15} />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <SettingPanel
                icon={User}
                title="Account Profile"
                description="Update the admin identity used for receipts, support messages, and internal audit trails."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Full name"
                    name="fullName"
                    value={accountSettings.fullName}
                    onChange={handleAccountChange}
                  />
                  <Field
                    label="Account email"
                    name="email"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                    type="email"
                  />
                  <Field
                    label="Role"
                    name="role"
                    value={accountSettings.role}
                    onChange={handleAccountChange}
                  />
                  <Field
                    label="Support email"
                    name="supportEmail"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                    type="email"
                  />
                </div>
              </SettingPanel>

              <SettingPanel
                icon={Building2}
                title="Business Details"
                description="Control merchant-facing names, checkout copy, and descriptors shown around your payment flow."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Business name"
                    name="businessName"
                    value={businessSettings.businessName}
                    onChange={handleBusinessChange}
                  />
                  {[
                    {
                      label: "Business Tag",
                      name: "businessTag",
                      options: [
                        "Tech",
                        "Apparel",
                        "Consulting",
                        "Food & Beverage",
                        "Digital Services",
                        "Art & NFTs",
                        "Academia",
                        "Gaming",
                        "Events",
                        "Health & Wellness",
                        "Subscriptions",
                        "Other",
                      ],
                    },
                  ].map((field) => (
                    <label
                      className="flex min-w-0 flex-col gap-2"
                      key={field.name}
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {field.label}
                      </span>
                      <select
                        value={
                          businessSettings[field.name as keyof BusinessSettings]
                        }
                        onChange={(event) =>
                          setBusinessSettings((prev) => ({
                            ...prev,
                            [field.name]: event.target.value,
                          }))
                        }
                        className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                      >
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                  <label className="flex min-w-0 flex-col gap-2 md:row-span-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Checkout description
                    </span>
                    <textarea
                      name="description"
                      value={businessSettings.description}
                      onChange={handleBusinessChange}
                      rows={5}
                      className="h-full min-h-28 w-full resize-none rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Upload Logo
                    </span>
                    <div className="flex items-center gap-4 rounded-sm border border-slate-300 bg-slate-50 p-3">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Business logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="text-slate-300" size={28} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#10b981] px-3 py-2 text-[12px] font-bold text-white transition hover:bg-emerald-700">
                          <Upload size={15} />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="mt-2 truncate text-[11px] text-slate-500">
                          {logoFile?.name || "PNG, JPG, or SVG image"}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </SettingPanel>

              <SettingPanel
                icon={SlidersHorizontal}
                title="Developer Defaults"
                description="Set the default network behavior and checkout mode used by your integration tools."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "Default network",
                      name: "defaultNetwork",
                      options: [
                        "Arbitrum Sepolia",
                        "Base Sepolia",
                        "Ethereum Sepolia",
                      ],
                    },
                    {
                      label: "Webhook retries",
                      name: "webhookRetries",
                      options: ["1", "3", "5"],
                    },
                  ].map((field) => (
                    <label
                      className="flex min-w-0 flex-col gap-2"
                      key={field.name}
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {field.label}
                      </span>
                      <select
                        value={
                          developerSettings[
                            field.name as keyof DeveloperSettings
                          ]
                        }
                        onChange={(event) =>
                          setDeveloperSettings((prev) => ({
                            ...prev,
                            [field.name]: event.target.value,
                          }))
                        }
                        className="w-full rounded-sm border border-slate-300 bg-slate-50 px-3 py-2.5 text-[12px] text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white"
                      >
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </SettingPanel>
            </div>

            <aside className="space-y-6">
              <SettingPanel
                icon={Bell}
                title="Notifications"
                description="Choose which operational events should reach the account team."
              >
                <div className="space-y-3">
                  <ToggleRow
                    title="Successful payments"
                    description="Send a notice when a checkout settles."
                    enabled={notifications.paymentSuccess}
                    onToggle={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        paymentSuccess: !prev.paymentSuccess,
                      }))
                    }
                  />
                  <ToggleRow
                    title="Failed payments"
                    description="Alert the team when a payment cannot confirm."
                    enabled={notifications.paymentFailed}
                    onToggle={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        paymentFailed: !prev.paymentFailed,
                      }))
                    }
                  />
                  {/* <ToggleRow
                    title="Webhook issues"
                    description="Notify developers when delivery starts failing."
                    enabled={notifications.webhookIssues}
                    onToggle={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        webhookIssues: !prev.webhookIssues,
                      }))
                    }
                  /> */}
                  {/* <ToggleRow
                    title="Weekly summary"
                    description="Receive a weekly digest of payments and failures."
                    enabled={notifications.weeklySummary}
                    onToggle={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        weeklySummary: !prev.weeklySummary,
                      }))
                    }
                  /> */}
                </div>
              </SettingPanel>

              <SettingPanel
                icon={LockKeyhole}
                title="Security"
                description="Tighten access, confirmation, and environment controls."
              >
                <div className="space-y-3">
                  <ToggleRow
                    title="Wallet confirmation"
                    description="Require wallet confirmation for sensitive changes."
                    enabled={security.requireWalletConfirmation}
                    onToggle={() =>
                      setSecurity((prev) => ({
                        ...prev,
                        requireWalletConfirmation:
                          !prev.requireWalletConfirmation,
                      }))
                    }
                  />
                  {/* <ToggleRow
                    title="Testnet guard"
                    description="Keep this workspace locked to testnet rails."
                    enabled={security.allowTestnetOnly}
                    onToggle={() =>
                      setSecurity((prev) => ({
                        ...prev,
                        allowTestnetOnly: !prev.allowTestnetOnly,
                      }))
                    }
                  />
                  <ToggleRow
                    title="Session alerts"
                    description="Notify the owner when a new device signs in."
                    enabled={security.sessionAlerts}
                    onToggle={() =>
                      setSecurity((prev) => ({
                        ...prev,
                        sessionAlerts: !prev.sessionAlerts,
                      }))
                    }
                  /> */}
                </div>
              </SettingPanel>

              <section className="border border-red-200 bg-red-50 p-6 rounded-sm space-y-10">
                <h1 className="text-[23px] jetbrains-monz font-bold text-[#10b981]">
                  Danger Zone
                </h1>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-100 text-red-700">
                      <LogOut size={20} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-red-950">
                        Account Session
                      </h3>
                      <p className="mt-1 text-[12px] leading-5 text-red-800">
                        Sign out of this merchant console on the current device.
                      </p>
                    </div>
                  </div>

                  {authenticated ? (
                    <button
                      type="button"
                      onClick={() => logOut()}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-red-800 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  ) : (
                    <div className="mt-5 border border-red-200 bg-white px-4 py-3 text-[12px] font-bold text-red-700">
                      You need to login.
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-100 text-red-700">
                      <Trash size={20} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-red-950">
                        Account Deletion
                      </h3>
                      <p className="mt-1 text-[12px] leading-5 text-red-800">
                        Permanently delete your account and all associated data.
                      </p>
                    </div>
                  </div>

                  {authenticated ? (
                    <button
                      type="button"
                      onClick={() => deleteAccount()}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-red-800 px-4 py-2.5 text-[12px] font-bold text-red-800 transition hover:bg-red-700/30"
                    >
                      <Trash size={16} />
                      Delete Account
                    </button>
                  ) : (
                    <div className="mt-5 border border-red-200 bg-white px-4 py-3 text-[12px] font-bold text-red-700">
                      <Link to="/signin">
                        <button className="px-4 py-2 text-[13px] text-black transition hover:font-bold hover:underline">
                          Login
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            </aside>
          </div>

          <section className="mt-6 grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-3 rounded-sm">
            <div className="flex gap-3">
              <Mail className="shrink-0 text-[#10b981]" size={20} />
              <div>
                <p className="text-[12px] font-bold text-slate-900">
                  Email Support
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {accountSettings.email}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Smartphone className="shrink-0 text-[#10b981]" size={20} />
              <div>
                <p className="text-[12px] font-bold text-slate-900">
                  Device Notices
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {security.sessionAlerts
                    ? "New device alerts enabled"
                    : "Alerts muted"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Wallet className="shrink-0 text-[#10b981]" size={20} />
              <div>
                <p className="text-[12px] font-bold text-slate-900">
                  Connected Wallet
                </p>
                <p className="mt-1 break-all text-[11px] text-slate-500">
                  {shortenValue(walletAddress, 10)}
                </p>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Settings;
