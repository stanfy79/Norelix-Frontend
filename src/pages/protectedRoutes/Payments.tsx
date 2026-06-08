// src/pages/Payments.tsx
import { usePrivy } from "@privy-io/react-auth";
import React, { useContext, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import { PaymentHistory } from "../../components/common/PaymentHistory";
import { FullScreenLoader } from "../../components/ui/fullscreen-loader";
import { CircleUser } from "lucide-react";
import { showSuccessToast } from "../../components/ui/custom-toast";
import { Skeleton } from "../../components/ui/skeleton";
import { DataContext } from "../../context/Context";
import Footer from "../../components/common/Footer";

const Payments: React.FC = () => {
  const { analyticsData, apiLoading, businessData, getBusinessAnalytics } =
    useContext(DataContext) as {
      businessData: any;
      analyticsData: any;
      apiLoading?: {
        business: boolean;
        analytics: boolean;
        txHistory: boolean;
      };
      getBusinessAnalytics: () => void;
    };
  const isBusinessLoading = Boolean(apiLoading?.business);
  const showBusinessData = Boolean(businessData?.businessId);
  const isAnalyticsLoading =
    Boolean(apiLoading?.analytics) || (showBusinessData && !analyticsData);
  const showDashboardSkeleton =
    isBusinessLoading || (showBusinessData && isAnalyticsLoading);

  const { ready, user } = usePrivy();
  const [activeTab, setActiveTab] = useState<string>("Payments");

  React.useEffect(() => {
    if (ready) {
      getBusinessAnalytics();
    }
  }, [ready]);

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden bg-[#f1f5f9]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mt-16 md:mt-0 p-6 w-full space-y-12 jetbrains-mono overflow-y-auto h-screen no-scrollbar">
          <div className="flex flex-wrap gap-y-3 justify-between items-center">
            <div>
              <h2 className="md:text-2xl font-bold text-slate-900 jetbrains-mono">
                Payment History
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[12px] jetbrains-mono uppercase">
                  Network: Arbritrum Sepolia
                </span>
              </div>
            </div>
            <div
              className="p-2 flex gap-3 items-center bg-white border-2 border-slate-200 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(user?.wallet?.address),
                );
                showSuccessToast("Wallet Address Copied Successfully!");
              }}
            >
              <CircleUser />
              <span className="text-[10px] jetbrains-mono font-bold">
                {user?.wallet?.address.substring(0, 5)}•••
                {user?.wallet?.address.substring(
                  user?.wallet?.address.length - 5,
                )}
              </span>
            </div>
          </div>

          <section>
            <div className="flex-1 bg-white border border-slate-200 p-6 flex flex-row gap-x-2 justify-between rounded-sm">
              {showDashboardSkeleton ? (
                <>
                  <div className="w-full space-y-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="w-full space-y-4 border-l border-slate-200 pl-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </>
              ) : businessData?.businessId ? (
                <>
                  <div className="w-full space-y-2">
                    <div className="flex gap-x-3 items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
                      <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                        Pending
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[24px] font-bold text-slate-900 tracking-tight jetbrains-mono">
                        {analyticsData?.summary?.pendingPayments ?? 0}
                      </h4>
                      <p className="jetbrains-mono text-slate-400 text-[12px] mt-2 font-medium tracking-tight">
                        Awaiting confirmation
                      </p>
                    </div>
                  </div>

                  <div className="w-full space-y-2 border-l border-slate-400  place-items-end">
                    <div className="flex gap-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                      <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                        Failed
                      </span>
                    </div>
                    <div className="place-items-end">
                      <h4 className="text-[24px] font-bold text-slate-900 tracking-tight jetbrains-mono">
                        {analyticsData?.summary?.failedPayments ?? 0}
                      </h4>
                      <p className="jetbrains-mono text-slate-400 text-[12px] mt-2 font-medium tracking-tight text-right">
                        Failed confirmation
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="items-center justify-center flex-col flex">
                  <p className="text-[16px] py-7 text-slate-500">
                    No Payment Data
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <PaymentHistory historyCount={30} />

            <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button className="jetbrains-mono text-[12px] font-bold text-[#10b981] hover:text-emerald-700 hover:underline uppercase tracking-tight transition-colors">
                View Full Audit Log →
              </button>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Payments;
