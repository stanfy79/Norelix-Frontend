import { ChartNoAxesCombined, CircleCheck, WalletCards } from "lucide-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Footer from "../../components/common/Footer";
import { PaymentHistory } from "../../components/common/PaymentHistory";
import { usePrivy } from "@privy-io/react-auth";
import { FullScreenLoader } from "../../components/ui/fullscreen-loader";
import ConnectionError from "../../components/layout/ConnectionError";
import { DataContext } from "../../context/Context";
import { Skeleton } from "../../components/ui/skeleton";

type TrendVolume = {
  raw: string;
  display: string;
};

type DailyTrend = {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  date: string;
  volume: TrendVolume;
  successfulVolume: TrendVolume;
};

const Dashboard: React.FC = () => {
  const { ready } = usePrivy();
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { businessData, analyticsData, apiLoading, getBusinessAnalytics, } = useContext(
    DataContext,
  ) as {
    businessData: any;
    analyticsData: any;
    apiLoading?: {
      business: boolean;
      analytics: boolean;
      txHistory: boolean;
    };
    getBusinessAnalytics: () => void;
  };

  React.useEffect(() => {
      if (ready) {
        getBusinessAnalytics();
      }
    }, [ready]);

  const isBusinessLoading = Boolean(apiLoading?.business);
  const showBusinessData = Boolean(businessData?.businessId);
  const isAnalyticsLoading = Boolean(apiLoading?.analytics) || (showBusinessData && !analyticsData);
  const showDashboardSkeleton = isBusinessLoading || (showBusinessData && isAnalyticsLoading);

  const dailyTrend = useMemo<DailyTrend[]>(() => {
    if (!Array.isArray(analyticsData?.dailyTrend)) {
      return [];
    }

    return analyticsData.dailyTrend.slice(0, 7).toReversed();
  }, [analyticsData]);

  const retryModal = () => {
    setIsOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (!ready) {
      setIsOpen(true);
    }
  }, [ready]);

  const formatTrendDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!ready) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <ConnectionError open={isOpen} onRetry={retryModal} />

      <div className="flex flex-1 overflow-hidden bg-[#f1f5f9]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mt-16 md:mt-0 p-6 w-full space-y-12 jetbrains-mono overflow-y-auto h-screen no-scrollbar">
          <div className="flex flex-wrap gap-y-3 justify-between items-end">
            <div>
              <h2 className="md:text-2xl font-bold text-slate-900 jetbrains-mono">
                Dashboard
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[12px] jetbrains-mono uppercase">
                  System Status: Operational
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                <span className="font-mono text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  Current Network
                </span>
                <span className="font-mono text-slate-900 text-[14px] font-medium tracking-tight">
                  Testnet v1.0
                </span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                  Last Updated
                </span>
                <span className="font-mono text-slate-900 text-[14px] font-medium tracking-tight">
                  14:02:41 UTC
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mb-12">
            {isBusinessLoading ? (
              <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 px-8 py-4 relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-7 w-36" />
                  </div>
                  <Skeleton className="h-7 w-12" />
                </div>
                <div className="h-64 w-full flex items-end gap-1 pt-4">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="w-full"
                      style={
                        { height: `${30 + index * 9}%` } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              </div>
            ) : businessData?.businessId ? (
              <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 px-8 py-4 place-content-end relative overflow-hidden">
                <div className="absolute top-16 left-5 p-4 text-[#10b981] pointer-events-none opacity-10">
                  <ChartNoAxesCombined size={100} />
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-1">
                      Volume (7D)
                    </p>
                    <h3 className="text-[20px] font-extrabold text-slate-900 tracking-tight leading-none">
                      {isAnalyticsLoading ? (
                        <Skeleton className="h-6 w-32" />
                      ) : (
                        <>
                          $
                          {analyticsData?.summary?.totalVolume?.display?.toLocaleString() ??
                            "0.00"}
                        </>
                      )}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-slate-100 text-slate-900 font-mono text-[10px] font-bold border border-slate-200 rounded-sm">
                      1W
                    </button>
                  </div>
                </div>

                <div className="h-64 w-full flex items-end gap-1 pt-4">
                  {isAnalyticsLoading ? (
                    Array.from({ length: 7 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="w-full"
                        style={
                          {
                            height: `${26 + index * 8}%`,
                          } as React.CSSProperties
                        }
                      />
                    ))
                  ) : dailyTrend.length > 0 ? (
                    dailyTrend.map((height: DailyTrend, index: number) => (
                      <div
                        className="w-full h-full relative group place-content-end"
                        key={index}
                      >
                        <div
                          className={`pointer-events-none absolute bottom-8 z-30 w-56 border border-slate-200 bg-white p-4 text-slate-900 shadow-xl opacity-0 transition-all duration-200 group-hover:translate-y-[-4px] group-hover:opacity-100 ${
                            index === 0
                              ? "left-0"
                              : index === 6
                                ? "right-0"
                                : "left-1/2 -translate-x-1/2"
                          }`}
                        >
                          <div className="mb-3 border-b border-slate-100 pb-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Payment Activity
                            </p>
                            <p className="mt-1 text-[12px] font-bold text-slate-900">
                              {formatTrendDate(height.date)}
                            </p>
                          </div>

                          <div className="text-[11px]">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500">Total</span>
                              <span className="font-bold text-slate-900">
                                {height.totalPayments}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500">Successful</span>
                              <span className="font-bold text-emerald-600">
                                {height.successfulPayments}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500">Failed</span>
                              <span className="font-bold text-red-600">
                                {height.failedPayments}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-2">
                              <span className="text-slate-500">Volume</span>
                              <span className="font-bold text-slate-900">
                                ${height.volume?.display ?? "0.00"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-500">Settled</span>
                              <span className="font-bold text-slate-900">
                                ${height.successfulVolume?.display ?? "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{ height: `${height.totalPayments}%` }}
                          className={`relative border-t-2 transition-all duration-300 ${
                            index === 6
                              ? "bg-emerald-500/20 border-emerald-500"
                              : "bg-emerald-100/50 border-emerald-500"
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[12px] font-bold uppercase text-slate-400">
                      No analytics data
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="col-span-12 lg:col-span-8 bg-white border h-90 border-slate-200 p-8 relative overflow-hidden items-center justify-center flex-col flex">
                <p className="text-[16px] text-slate-500">No Payment Data</p>
                <button className="brutal text-[14px] bg-[#10b981] jetbrains-mono p-3 mt-4">
                  Create New Business
                </button>
              </div>
            )}

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="flex-1 bg-gray-100 border border-slate-500/70 p-6 flex flex-col justify-between border-b-4 border-b-emerald-500 rounded-sm">
                {showDashboardSkeleton ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </>
                ) : businessData?.businessId ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-extrabold text-slate-500 uppercase font-mono tracking-wider">
                        Settled Balance
                      </span>
                      <span className="material-symbols-outlined text-[#10b981]">
                        <WalletCards />
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[24px] font-bold text-black tracking-tight jetbrains-mono">
                        $
                        {analyticsData?.summary?.successfulVolume?.display ??
                          "0.00"}
                      </h4>
                      <button className="mt-2 font-mono text-[10px] text-slate-400 hover:text-slate-700 hover:underline uppercase font-bold tracking-tight transition-colors">
                        Initiate Withdrawal →
                      </button>
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

              <div className="flex-1 bg-white border border-slate-200 p-6 flex flex-col justify-between rounded-sm">
                {showDashboardSkeleton ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </>
                ) : businessData?.businessId ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                        Average Payment
                      </span>
                      <span className="material-symbols-outlined text-[#10b981]">
                        <CircleCheck />
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[24px] font-bold text-slate-900 tracking-tight jetbrains-mono">
                        $
                        {analyticsData?.summary?.averagePayment?.display?.toLocaleString() ??
                          "0.00"}
                      </h4>
                      <p className="text-emerald-600 text-[12px] mt-2 font-medium tracking-tight jetbrains-mono">
                        +14.2% from yesterday
                      </p>
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
            </div>
          </div>

          <section className="">
            <div className="row-span-12 lg:row-span-4 flex flex-row flex-wrap gap-6">
              <div className="flex-1 bg-white border border-slate-200 p-6 flex flex-col justify-between rounded-sm">
                {showDashboardSkeleton ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </>
                ) : businessData?.businessId ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                        Successful Payment
                      </span>
                      <span className="material-symbols-outlined text-[#10b981]">
                        <CircleCheck />
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[24px] font-bold text-slate-900 tracking-tight jetbrains-mono">
                        {analyticsData?.summary?.successfulPayments ?? 0}
                      </h4>
                      <p className="text-emerald-600 text-[12px] mt-2 font-medium tracking-tight jetbrains-mono">
                        +14.2% from yesterday
                      </p>
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

              <div className="flex-1 bg-white border border-slate-200 p-6 flex flex-row gap-x-2 justify-between rounded-sm">
                {showDashboardSkeleton ? (
                  <>
                    <div className="w-full space-y-4">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="w-full space-y-4 border-l border-slate-200 pl-4">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </>
                ) : businessData?.businessId ? (
                  <>
                    <div className="w-full space-y-2 relative">
                      <div className="absolute top-0 right-0 p-4 text-[#10b981] pointer-events-none opacity-10">
                        <ChartNoAxesCombined size={70} />
                      </div>
                      <div className="flex gap-x-3 items-center">
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                          Success Rate
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[24px] font-bold text-[#064e3b] tracking-tight jetbrains-mono">
                          {analyticsData?.summary?.successRate ?? 0}%
                        </h4>
                        <p className="jetbrains-mono text-slate-400 text-[12px] mt-2 font-medium tracking-tight">
                          Chances of success
                        </p>
                      </div>
                    </div>

                    <div className="w-full space-y-2 border-l border-slate-400  place-items-end relative">
                      <div className="absolute top-0 left-0 p-4 text-red-600 pointer-events-none opacity-10">
                        <ChartNoAxesCombined size={70} />
                      </div>
                      <div className="flex gap-x-2 items-center">
                        <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                          Failure Rate
                        </span>
                      </div>
                      <div className="place-items-end">
                        <h4 className="text-[24px] font-bold text-red-700 tracking-tight jetbrains-mono">
                          {analyticsData?.summary?.failureRate ?? 0}%
                        </h4>
                        <p className="jetbrains-mono text-slate-400 text-[12px] mt-2 font-medium tracking-tight text-right">
                          Chances of Failure
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
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <PaymentHistory historyCount={10} />

            <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex justify-center">
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

export default Dashboard;
