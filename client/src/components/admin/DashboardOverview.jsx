import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, IndianRupee, HeartHandshake, TrendingUp, CalendarClock, CalendarRange, CalendarDays, Sparkles } from "lucide-react";
import { useGetAnalyticsQuery } from "../../features/api/apiSlice";
import DetailModal from "../../components/admin/DetailModal";

const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Active: "bg-violet-50 text-violet-700 border-violet-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAnalyticsQuery();
  const analytics = data?.data || {};
  const [activeBooking, setActiveBooking] = useState(null);

  const primaryStats = [
    { label: "Total Revenue", value: `₹${Number(analytics.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, gradient: "from-emerald-50 to-white", iconColor: "text-emerald-600", to: "/admin/payments" },
    { label: "Total Users", value: analytics.totalUsers || 0, icon: Users, gradient: "from-violet-50 to-white", iconColor: "text-violet-600", to: "/admin/users" },
    { label: "Total Bookings", value: analytics.totalBookings || 0, icon: HeartHandshake, gradient: "from-fuchsia-50 to-white", iconColor: "text-fuchsia-600", to: "/admin/bookings" },
    { label: "Active Services", value: analytics.activeServicesCount || 0, icon: Sparkles, gradient: "from-amber-50 to-white", iconColor: "text-amber-600", to: "/admin/services" },
  ];

  const transactionStats = [
    { label: "Today", value: analytics.transactionsToday ?? 0, icon: CalendarClock, gradient: "from-sky-50 to-white", iconColor: "text-sky-600" },
    { label: "This Week", value: analytics.transactionsWeek ?? 0, icon: CalendarRange, gradient: "from-indigo-50 to-white", iconColor: "text-indigo-600" },
    { label: "This Month", value: analytics.transactionsMonth ?? 0, icon: CalendarDays, gradient: "from-purple-50 to-white", iconColor: "text-purple-600" },
    { label: "Catalog Size", value: analytics.totalServicesCount ?? analytics.activeServicesCount ?? 0, icon: TrendingUp, gradient: "from-rose-50 to-white", iconColor: "text-rose-600", to: "/admin/services" },
  ];

  const recentBookings = analytics.recentBookings || [];

  const StatCard = ({ stat, i }) => {
    const Icon = stat.icon;
    return (
      <div
        onClick={() => stat.to && navigate(stat.to)}
        style={{ animationDelay: `${i * 50}ms` }}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-3.5 shadow-sm opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards] transition-all duration-200 active:scale-95 sm:p-5 sm:hover:-translate-y-1 sm:hover:shadow-lg sm:hover:shadow-violet-100 ${stat.gradient}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">{stat.label}</span>
          <div className={`rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm transition-transform duration-200 group-hover:scale-110 sm:rounded-xl sm:p-2.5 ${stat.iconColor}`}>
            <Icon size={16} className="sm:hidden" />
            <Icon size={20} className="hidden sm:block" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2 sm:mt-4 sm:gap-3">
          <span className="text-lg font-extrabold text-slate-900 sm:text-2xl md:text-3xl">{stat.value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {primaryStats.map((stat, i) => <StatCard key={stat.label} stat={stat} i={i} />)}
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:mb-3 sm:text-xs">Transaction Pulse</p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {transactionStats.map((stat, i) => <StatCard key={stat.label} stat={stat} i={i + 4} />)}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">Recent Bookings</h2>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="cursor-pointer rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-md shadow-violet-500/25 transition hover:brightness-110 active:scale-95 sm:px-4 sm:py-2 sm:text-xs"
          >
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">Loading analytics...</div>
        ) : isError ? (
          <div className="px-6 py-10 text-center text-sm text-rose-600">Unable to load analytics.</div>
        ) : recentBookings.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">No recent bookings yet.</div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="divide-y divide-slate-100 md:hidden">
              {recentBookings.map((b) => (
                <button
                  key={b._id}
                  onClick={() => setActiveBooking(b)}
                  className="flex w-full cursor-pointer flex-col gap-1.5 px-4 py-3.5 text-left transition active:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">{b.userId?.fullName || "Registered User"}</span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[b.status] || statusStyles.Pending}`}>
                      {b.status || "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">{b.serviceName || b.serviceId?.title || "-"}</span>
                    <span className="shrink-0 font-bold text-violet-600">₹{Number(b.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "-"}</div>
                </button>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((b) => (
                    <tr key={b._id} onClick={() => setActiveBooking(b)} className="cursor-pointer transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{b._id?.slice(-8) || "-"}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{b.userId?.fullName || "Registered User"}</td>
                      <td className="px-6 py-4">{b.serviceName || b.serviceId?.title || "-"}</td>
                      <td className="px-6 py-4 font-bold text-violet-600">₹{Number(b.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[b.status] || statusStyles.Pending}`}>
                          {b.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {activeBooking && (
        <DetailModal title="Booking Details" subtitle={`#${activeBooking._id?.slice(-8)}`} onClose={() => setActiveBooking(null)}>
          <div className="space-y-3 text-sm">
            <Row label="Customer" value={activeBooking.userId?.fullName || "Registered User"} />
            <Row label="Email" value={activeBooking.userId?.email || "-"} />
            <Row label="Service" value={activeBooking.serviceName || activeBooking.serviceId?.title || "-"} />
            <Row label="Amount" value={`₹${Number(activeBooking.amount || 0).toLocaleString()}`} />
            <Row label="Status" value={activeBooking.status || "Pending"} />
            <Row label="Booked On" value={activeBooking.createdAt ? new Date(activeBooking.createdAt).toLocaleString() : "-"} />
          </div>
        </DetailModal>
      )}

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2">
    <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
    <span className="text-right font-medium text-slate-900">{value}</span>
  </div>
);

export default DashboardOverview;