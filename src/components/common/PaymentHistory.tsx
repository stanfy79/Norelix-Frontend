import { ExternalLink, Funnel, Search } from "lucide-react";
import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../../context/Context";
import { usePrivy } from "@privy-io/react-auth";
import { TableSkeletonRows } from "../ui/skeleton";

interface Transaction {
  id: string;
  hash: string;
  orderId: string;
  status: "Confirmed" | "Pending" | "Failed";
  amount: string;
  method?: string;
  time: string;
  date: string;
}

type RawTransaction = Record<string, unknown>;

type History = {
  historyCount: number;
};

export const PaymentHistory = ({ historyCount }: History) => {
  const { ready } = usePrivy();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const { businessData, txHistory, apiLoading, getBusinessPayments } = useContext(DataContext) as {
    businessData: any;
    txHistory: RawTransaction[];
    apiLoading?: {
      business: boolean;
      txHistory: boolean;
      analytics: boolean;
    };
    getBusinessPayments: () => void;
  };

  const isBusinessLoading = Boolean(apiLoading?.business);
  const isTxHistoryLoading = Boolean(apiLoading?.txHistory);

  React.useEffect(() => {
    if (ready) {
      getBusinessPayments();
    }
  }, [ready]);

  const getStringValue = (value: unknown, fallback = "") => {
    if (value === null || value === undefined) return fallback;
    return String(value);
  };

  const getStatus = (status: unknown): Transaction["status"] => {
    const normalizedStatus = getStringValue(status).toUpperCase();

    if (["CONFIRMED", "COMPLETED", "SUCCESS", "SUCCESSFUL"].includes(normalizedStatus)) {
      return "Confirmed";
    }

    if (["FAILED", "FAILURE", "ERROR", "CANCELLED"].includes(normalizedStatus)) {
      return "Failed";
    }

    return "Pending";
  };

  const getDateParts = (dateValue: unknown) => {
    if (!dateValue) {
      return { date: "N/A", time: "N/A" };
    }

    const rawDate =
      typeof dateValue === "number" && dateValue.toString().length === 10
        ? dateValue * 1000
        : getStringValue(dateValue);
    const parsedDate = new Date(rawDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return { date: getStringValue(dateValue), time: "N/A" };
    }

    return {
      date: parsedDate.toISOString().slice(0, 10),
      time: parsedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const transactions = useMemo<Transaction[]>(() => {
    return txHistory.map((tx, index) => {
      const hash = getStringValue(tx.txHash ?? tx.transactionHash ?? tx.hash);
      const orderId = getStringValue(tx.orderId ?? tx.orderID ?? tx.order_id, "N/A");
      const amount = getStringValue(tx.amount ?? tx.amountPaid ?? tx.value, "0");
      const asset = getStringValue(tx.currency ?? tx.asset ?? tx.tokenSymbol, "USDC");
      const method = getStringValue(tx.paymentMethod ?? tx.method ?? tx.channel, "N/A");
      const { date, time } = getDateParts(tx.createdAt ?? tx.updatedAt ?? tx.timestamp ?? tx.date);
      const formattedAmount = /[a-zA-Z]/.test(amount) ? amount : `${amount} ${asset}`;

      return {
        id: getStringValue(tx.id ?? tx._id ?? hash, `tx-${index}`),
        hash,
        orderId,
        status: getStatus(tx.status ?? tx.paymentStatus),
        amount: formattedAmount,
        date,
        time,
        method,
      };
    });
  }, [txHistory]);

  const getAmountValue = (amount: string) =>
    Number(amount.replace(/[^0-9.-]+/g, ""));

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const min = minAmount === "" ? null : Number(minAmount);
    const max = maxAmount === "" ? null : Number(maxAmount);

    return transactions.filter((tx) => {
      const amountValue = getAmountValue(tx.amount);
      const matchesSearch =
        !query ||
        tx.hash.toLowerCase().includes(query) ||
        tx.orderId.toLowerCase().includes(query) ||
        tx.amount.toLowerCase().includes(query) ||
        amountValue.toString().includes(query);
      const matchesStatus =
        statusFilter === "All" || tx.status === statusFilter;
      const matchesStartDate = !startDate || tx.date >= startDate;
      const matchesMethod = !tx.method || tx.method.toLowerCase().includes(query);
      const matchesEndDate = !endDate || tx.date <= endDate;
      const matchesMinAmount = min === null || amountValue >= min;
      const matchesMaxAmount = max === null || amountValue <= max;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinAmount &&
        matchesMethod &&
        matchesMaxAmount
      );
    });
  }, [
    transactions,
    searchQuery,
    statusFilter,
    startDate,
    endDate,
    minAmount,
    maxAmount,
  ]);

  return (
    <>
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <h3 className="text-[18px] font-bold text-slate-900 tracking-tight">
            Recent Transactions
          </h3>

          <div className="flex items-center flex-wrap gap-4">
            <div className="relative glow-emerald transition-all">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">
                <Search />
              </span>
              <input
                className="pl-10 pr-4 py-2 border border-slate-400 focus:border jetbrains-mono text-[12px] text-black bg-slate-50 w-full sm:w-64 transition-all outline-none rounded-sm placeholder:text-slate-400"
                placeholder="Search hash, order ID, or amount..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-400 font-mono text-[12px] text-slate-600 hover:border-slate-400 transition-colors rounded-sm font-bold"
              type="button"
              onClick={() => setShowFilters((current) => !current)}
            >
              <span className="material-symbols-outlined text-sm">
                <Funnel />
              </span>
              Filter
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                Status
              </span>
              <select
                className="px-3 py-2 border border-slate-300 bg-slate-50 text-black text-[12px] font-mono outline-none rounded-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                From Date
              </span>
              <input
                className="px-3 py-2 border border-slate-300 bg-slate-50 text-black text-[12px] font-mono outline-none rounded-sm"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                To Date
              </span>
              <input
                className="px-3 py-2 border border-slate-300 bg-slate-50 text-black text-[12px] font-mono outline-none rounded-sm"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                Min Amount
              </span>
              <input
                className="px-3 py-2 border border-slate-300 bg-slate-50 text-black text-[12px] font-mono outline-none rounded-sm"
                min="0"
                placeholder="0"
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-mono text-[10px] font-bold uppercase text-slate-400">
                Max Amount
              </span>
              <input
                className="px-3 py-2 border border-slate-300 bg-slate-50 text-black text-[12px] font-mono outline-none rounded-sm"
                min="0"
                placeholder="50000"
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </label>

            <div className="flex items-end">
              <button
                className="w-full px-4 py-2 border border-slate-300 bg-white text-[12px] font-bold font-mono text-slate-600 hover:text-emerald-600 rounded-sm transition-colors"
                type="button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar scroll-smooth">
        {isBusinessLoading ? (
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-100">
              <TableSkeletonRows rows={4} columns={7} />
            </tbody>
          </table>
        ) : businessData?.businessId ? (
          <>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Transaction Hash
                  </th>
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Amount / Asset
                  </th>
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Order id
                  </th>
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Status
                  </th>
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Payment Method
                  </th>
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Date
                  </th>
                  <th className="px-8 py-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    Time
                  </th>
                  <th className="px-8 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isTxHistoryLoading ? (
                  <TableSkeletonRows rows={historyCount > 10 ? 8 : 5} columns={7} />
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.slice(0, historyCount).map((tx) => (
                    <tr
                      key={tx.id}
                      className="group hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 invisible group-hover:visible transition-all"></div>
                          <span className="text-slate-900 text-[12px] font-medium tracking-tight jetbrains-mono">
                            {tx.hash}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-slate-900 text-[12px] font-medium tracking-tight jetbrains-mono">
                          {tx.amount}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-slate-900 text-[12px] font-medium tracking-tight jetbrains-mono">
                          {tx.orderId}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase jetbrains-mono rounded-sm ${
                            tx.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : tx.status === "Pending"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-slate-500 text-[12px] font-medium tracking-tight jetbrains-mono">
                          {tx.method ?? "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-slate-500 text-[12px] font-medium tracking-tight jetbrains-mono">
                          {tx.date}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-slate-400 text-[12px] font-medium tracking-tight jetbrains-mono">
                          {tx.time}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-slate-400 hover:text-emerald-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">
                            <Link
                              to={`https://sepolia.arbiscan.io/tx/${tx.hash}`}
                              target="_black"
                            >
                              <ExternalLink size={17} />
                            </Link>
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-8 py-10 text-center text-sm font-mono text-slate-400 uppercase"
                    >
                      No transactions found match query parameters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <div className="items-center justify-center flex-col flex">
            <p className="text-[16px] py-7 text-slate-500">No Payment Data</p>
          </div>
        )}
      </div>
    </>
  );
};
