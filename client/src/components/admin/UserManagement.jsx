import { useState } from "react";
import { Search, Ban, CheckCircle2, RefreshCw, Phone, Calendar, UserCheck, AlertCircle, Eye, Filter, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useGetUsersQuery, useUpdateUserMutation, useGetBookingsQuery } from "../../features/api/apiSlice";
import DetailModal from "../../components/admin/DetailModal";
import UserAuditModal from "./UserAuditModal";

const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Active: "bg-violet-50 text-violet-700 border-violet-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetUsersQuery({
    page,
    limit: 10,
    search: search.trim() || undefined,
  });
  const [updateUser] = useUpdateUserMutation();

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalUsers || 0;

  const displayedUsers = users.filter((u) => {
    if (statusFilter === "active") return !u.isBlocked;
    if (statusFilter === "blocked") return !!u.isBlocked;
    return true;
  });

  const { data: userBookingsData, isLoading: bookingsLoading } = useGetBookingsQuery(
    { userId: viewUser?._id, page: 1 },
    { skip: !viewUser }
  );
  const userBookings = userBookingsData?.bookings || [];

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      setActionLoadingId(userId);
      await updateUser({ id: userId, isBlocked: !currentStatus }).unwrap();
      toast.success(!currentStatus ? "User blocked successfully" : "User unblocked successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update user status");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">User Management</h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Total registered users: <span className="font-semibold text-slate-900">{totalCount}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 sm:flex-none">
            <Filter size={14} className="shrink-0 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-full cursor-pointer bg-transparent text-xs font-medium text-slate-700 outline-none"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>

          <button
            onClick={refetch}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-violet-600" : ""} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14">
            <RefreshCw size={22} className="animate-spin text-violet-600" />
            <span className="text-xs text-slate-400">Fetching users...</span>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14">
            <AlertCircle size={22} className="text-slate-300" />
            <span className="text-xs text-slate-400">No user records found.</span>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="divide-y divide-slate-100 md:hidden">
              {displayedUsers.map((u) => (
                <div key={u._id} onClick={() => setViewUser(u)} className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition active:bg-slate-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-sm font-bold text-violet-700">
                    {(u.fullName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-900">{u.fullName || "Unnamed User"}</span>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${u.isBlocked ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                    <div className="truncate text-xs text-slate-500">{u.email}</div>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-slate-300" />
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Contact No</th>
                    <th className="px-6 py-4">Profile KYC</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedUsers.map((u) => (
                    <tr key={u._id} className="cursor-pointer transition hover:bg-slate-50/80" onClick={() => setViewUser(u)}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{u.fullName || "Unnamed User"}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700">
                          <Phone size={12} className="text-slate-400" />
                          {u.contactNumber || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${u.isProfileCompleted ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-amber-200 bg-amber-50 text-amber-700"}`}>
                          <UserCheck size={11} />
                          {u.isProfileCompleted ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${u.isBlocked ? "border-rose-200 bg-rose-50 text-rose-600" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
                          {u.isBlocked ? <Ban size={12} /> : <CheckCircle2 size={12} />}
                          {u.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewUser(u)} className="cursor-pointer rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 active:scale-95">
                            <Eye size={14} />
                          </button>
                          <button
                            disabled={actionLoadingId === u._id}
                            onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition active:scale-95 ${u.isBlocked ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-rose-50 text-rose-600 hover:bg-rose-100"} disabled:opacity-40`}
                          >
                            {actionLoadingId === u._id ? "..." : u.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

      {viewUser && (
        <UserAuditModal
          userId={viewUser._id}
          onClose={() => setViewUser(null)}
          onUserUpdated={refetch}
        />
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:p-3">
    <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400 sm:text-[10px]">{label}</div>
    <div className="mt-0.5 truncate text-xs font-semibold text-slate-900 sm:text-sm">{value}</div>
  </div>
);

export default UserManagement;