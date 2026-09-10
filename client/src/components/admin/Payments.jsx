import { useState, useMemo } from "react";
import { Download, Search, Filter, ChevronRight, IndianRupee, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { useGetTransactionsQuery } from "../../features/api/apiSlice";
import DetailModal from "../../components/admin/DetailModal";

const Payments = () => {
  const { data, isLoading, isError } = useGetTransactionsQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewTx, setViewTx] = useState(null);

  const transactions = data?.transactions || [];
  const isSuccess = (status) => ["completed", "paid", "success"].includes((status || "").toLowerCase());

  const summary = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + (isSuccess(t.status) ? Number(t.amount || 0) : 0), 0);
    const successCount = transactions.filter((t) => isSuccess(t.status)).length;
    const failedCount = transactions.length - successCount;
    return { total, successCount, failedCount };
  }, [transactions]);

  const filtered = transactions.filter((t) => {
    const name = t.userId?.fullName || t.userName || "";
    const service = t.serviceName || t.serviceId?.title || "";
    const matchesSearch = (name + service).toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "success" && isSuccess(t.status)) ||
      (statusFilter === "failed" && !isSuccess(t.status));
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const rows = [
      ["Transaction ID", "User", "Service", "Gateway", "Amount", "Status", "Valid Till", "Date"],
      ...filtered.map((t) => [
        t.paymentDetails?.razorpayPaymentId || t.paymentId || t.orderId || "-",
        t.userId?.fullName || t.userName || "-",
        t.serviceName || t.serviceId?.title || "-",
        t.gateway || "Razorpay",
        t.amount || 0,
        t.status || "-",
        t.validTill ? new Date(t.validTill).toLocaleDateString() : "-",
        t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Payment Transactions</h1>
          <p className="text-xs text-slate-500 sm:text-sm">Razorpay gateway payment logs and invoices.</p>
        </div>
        <button
          onClick={handleExport}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-95"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Stat Strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-3.5 shadow-sm sm:p-4">
          <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-emerald-600 shadow-sm sm:p-2.5">
            <IndianRupee size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">Successful Revenue</div>
            <div className="truncate text-lg font-extrabold text-slate-900 sm:text-xl">₹{summary.total.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-50 to-white p-3.5 shadow-sm sm:p-4">
          <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-emerald-600 shadow-sm sm:p-2.5">
            <CheckCircle2 size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">Successful Txns</div>
            <div className="text-lg font-extrabold text-slate-900 sm:text-xl">{summary.successCount}</div>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 to-white p-3.5 shadow-sm sm:p-4">
          <div className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-rose-500 shadow-sm sm:p-2.5">
            <XCircle size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">Failed Txns</div>
            <div className="text-lg font-extrabold text-slate-900 sm:text-xl">{summary.failedCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search user or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Filter size={14} className="shrink-0 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 cursor-pointer bg-transparent text-xs font-medium text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="px-6 py-14 text-center text-sm text-slate-400">Loading transactions...</div>
        ) : isError ? (
          <div className="px-6 py-14 text-center text-sm text-rose-600">Unable to load transactions.</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-14 text-center text-sm text-slate-400">No transactions found.</div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filtered.map((t) => {
                const success = isSuccess(t.status);
                return (
                  <div
                    key={t._id || t.paymentId || t.orderId}
                    onClick={() => setViewTx(t)}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition active:bg-slate-50"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${success ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
                      <CreditCard size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">{t.userId?.fullName || t.userName || "Registered User"}</span>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-600"}`}>
                          {t.status || "Pending"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="truncate">{t.serviceName || t.serviceId?.title || "-"}</span>
                        <span className="shrink-0 font-bold text-slate-900">₹{Number(t.amount || 0).toLocaleString()}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-400">
                        {t.gateway || "Razorpay"} · {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                      </div>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-slate-300" />
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Gateway</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Valid Till</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((t) => (
                    <tr key={t._id || t.paymentId || t.orderId} className="cursor-pointer transition hover:bg-slate-50" onClick={() => setViewTx(t)}>
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.paymentDetails?.razorpayPaymentId || t.paymentId || t.orderId}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{t.userId?.fullName || t.userName || "Registered User"}</td>
                      <td className="px-6 py-4">{t.serviceName || t.serviceId?.title || "-"}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-violet-600">{t.gateway || "Razorpay"}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{Number(t.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{t.validTill ? new Date(t.validTill).toLocaleDateString() : "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${isSuccess(t.status) ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-600"}`}>
                          {t.status || t.paymentDetails?.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {viewTx && (
        <DetailModal title="Transaction Details" subtitle={viewTx.paymentDetails?.razorpayPaymentId || viewTx.paymentId || viewTx.orderId} onClose={() => setViewTx(null)}>
          <div className="space-y-3 text-sm">
            <Row label="User" value={viewTx.userId?.fullName || viewTx.userName || "Registered User"} />
            <Row label="Email" value={viewTx.userId?.email || "-"} />
            <Row label="Service" value={viewTx.serviceName || viewTx.serviceId?.title || "-"} />
            <Row label="Gateway" value={viewTx.gateway || "Razorpay"} />
            <Row label="Order ID" value={viewTx.orderId || "-"} />
            <Row label="Payment ID" value={viewTx.paymentDetails?.razorpayPaymentId || viewTx.paymentId || "-"} />
            <Row label="Amount" value={`₹${Number(viewTx.amount || 0).toLocaleString()}`} />
            <Row label="Status" value={viewTx.status || viewTx.paymentDetails?.paymentStatus || "Pending"} />
            <Row label="Purchased On" value={viewTx.createdAt ? new Date(viewTx.createdAt).toLocaleString() : "-"} />
            <Row label="Valid Till" value={viewTx.validTill ? new Date(viewTx.validTill).toLocaleString() : "-"} />
          </div>
        </DetailModal>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2">
    <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    <span className="text-right font-medium text-slate-900">{value}</span>
  </div>
);

export default Payments;