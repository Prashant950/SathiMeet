import { useState } from "react";
import { Search, RefreshCw, Calendar, AlertCircle, Filter, ChevronRight } from "lucide-react";
import { useGetBookingsQuery, useUpdateBookingMutation } from "../../features/api/apiSlice";
import DetailModal from "../../components/admin/DetailModal";

const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Active: "bg-violet-50 text-violet-700 border-violet-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const Bookings = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);

  const { data, isLoading: loading, isFetching, refetch } = useGetBookingsQuery({
    page,
    status: statusFilter === "all" ? "" : statusFilter,
  });
  const [updateBooking] = useUpdateBookingMutation();
  const bookings = data?.bookings || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await updateBooking({ id, status: newStatus }).unwrap();
      if (viewBooking && (viewBooking._id === id || viewBooking.id === id)) {
        setViewBooking({ ...viewBooking, status: newStatus });
      }
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const customerName = b.userId?.fullName || b.user || "";
    const serviceTitle = b.serviceName || b.service || "";
    return (
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(search.toLowerCase()) ||
      b._id?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Companionship Bookings</h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Total bookings: <span className="font-semibold text-slate-900">{totalCount}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search user, service, id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-400 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:flex-none">
            <Filter size={14} className="shrink-0 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 w-full cursor-pointer bg-transparent text-xs font-medium text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button
            onClick={refetch}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            <RefreshCw size={16} className={loading || isFetching ? "animate-spin text-violet-600" : ""} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14">
            <RefreshCw size={22} className="animate-spin text-violet-600" />
            <span className="text-xs text-slate-400">Fetching bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14">
            <AlertCircle size={22} className="text-slate-300" />
            <span className="text-xs text-slate-400">No matching bookings found.</span>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredBookings.map((b) => {
                const customer = b.userId?.fullName || b.user || "Registered User";
                const service = b.serviceName || b.service || "Companion Session";
                const currentStatus = b.status || "Pending";
                return (
                  <div key={b._id || b.id} onClick={() => setViewBooking(b)} className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition active:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-slate-900">{customer}</span>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[currentStatus] || statusStyles.Pending}`}>{currentStatus}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="truncate">{service}</span>
                        <span className="shrink-0 font-bold text-violet-600">₹{Number(b.amount || 0).toLocaleString()}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar size={11} />
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : b.date}
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
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date & Slot</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => {
                    const bId = b._id ? `#${b._id.slice(-6).toUpperCase()}` : b.id;
                    const customer = b.userId?.fullName || b.user || "Registered User";
                    const email = b.userId?.email || "";
                    const service = b.serviceName || b.service || "Companion Session";
                    const dateStr = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : b.date;
                    const currentStatus = b.status || "Pending";

                    return (
                      <tr key={b._id || b.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => setViewBooking(b)}>
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">{bId}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{customer}</div>
                          {email && <div className="text-[11px] text-slate-400">{email}</div>}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">{service}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <Calendar size={13} className="text-slate-400" />
                            {dateStr}
                          </div>
                          {b.slot && <div className="pl-4 text-[11px] text-slate-400">{b.slot}</div>}
                        </td>
                        <td className="px-6 py-4 font-bold text-violet-600">₹{Number(b.amount || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[currentStatus] || statusStyles.Pending}`}>{currentStatus}</span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <select
                            disabled={updatingId === (b._id || b.id)}
                            value={currentStatus}
                            onChange={(e) => handleStatusUpdate(b._id || b.id, e.target.value)}
                            className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 outline-none hover:bg-white focus:border-violet-400 disabled:opacity-40"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3.5 sm:px-6 sm:py-4">
            <button disabled={page === 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">Prev</button>
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages || loading} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">Next</button>
          </div>
        )}
      </div>

      {viewBooking && (
        <DetailModal
          title={viewBooking.serviceName || viewBooking.service || "Booking Details"}
          subtitle={`#${(viewBooking._id || viewBooking.id || "").toString().slice(-8)}`}
          onClose={() => setViewBooking(null)}
        >
          <div className="space-y-3 text-sm">
            <Row label="Customer" value={viewBooking.userId?.fullName || viewBooking.user || "Registered User"} />
            <Row label="Email" value={viewBooking.userId?.email || "-"} />
            <Row label="Contact" value={viewBooking.userId?.contactNumber || "-"} />
            <Row label="Service" value={viewBooking.serviceName || viewBooking.service || "-"} />
            <Row label="Booking Date" value={viewBooking.bookingDate ? new Date(viewBooking.bookingDate).toLocaleString() : viewBooking.date || "-"} />
            <Row label="Slot" value={viewBooking.slot || "-"} />
            <Row label="Amount" value={`₹${Number(viewBooking.amount || 0).toLocaleString()}`} />
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">Status</span>
              <select
                disabled={updatingId === (viewBooking._id || viewBooking.id)}
                value={viewBooking.status || "Pending"}
                onChange={(e) => handleStatusUpdate(viewBooking._id || viewBooking.id, e.target.value)}
                className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 outline-none focus:border-violet-400"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
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

export default Bookings;