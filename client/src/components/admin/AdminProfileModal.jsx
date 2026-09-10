import { useState } from "react";
import { X, User, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../../features/api/apiSlice";

const AdminProfileModal = ({ onClose }) => {
  const { user, setUser } = useAuth(); // setUser optional — used to refresh local session name/email if your useAuth exposes it
  const [tab, setTab] = useState("profile"); // profile | security

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out] sm:items-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full flex-col rounded-t-3xl border border-slate-200 bg-white shadow-2xl animate-[slideUp_0.22s_ease-out] sm:max-w-lg sm:rounded-2xl sm:animate-[scaleIn_0.18s_ease-out]"
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pb-1 pt-2.5 sm:hidden">
          <span className="h-1.5 w-10 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-base font-bold text-white shadow-md shadow-violet-500/25">
              {(user?.fullName || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">Account Settings</h2>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-100 px-5 pt-3 sm:px-6">
          <button
            onClick={() => setTab("profile")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-xs font-semibold transition ${tab === "profile" ? "border-b-2 border-violet-600 text-violet-600" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <User size={14} /> Profile Info
          </button>
          <button
            onClick={() => setTab("security")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-xs font-semibold transition ${tab === "security" ? "border-b-2 border-violet-600 text-violet-600" : "text-slate-400 hover:text-slate-600"
              }`}
          >
            <Lock size={14} /> Password & Security
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {tab === "profile" ? <ProfileTab user={user} /> : <SecurityTab />}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
};

/* -------------------- Profile Info Tab -------------------- */
const ProfileTab = ({ user }) => {
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isDirty = fullName !== (user?.fullName || "") || email !== (user?.email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      await updateProfile({ fullName, email }).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-700">Full Name</label>
        <input
          required
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white sm:h-10 sm:text-xs"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">Email Address</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@sathimeet.com"
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white sm:h-10 sm:text-xs"
        />
        <p className="mt-1.5 text-[11px] text-slate-400">You may be asked to verify this email again if changed.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={14} />
          Profile updated successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={!isDirty || isLoading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:py-2.5"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

/* -------------------- Security / Password Tab -------------------- */
const SecurityTab = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = form.newPassword && form.newPassword === form.confirmPassword;
  const strongEnough = form.newPassword.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!strongEnough) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!passwordsMatch) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }).unwrap();
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Failed to change password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-700">Current Password</label>
        <div className="relative mt-1">
          <input
            required
            type={showCurrent ? "text" : "password"}
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-10 text-sm outline-none transition focus:border-violet-400 focus:bg-white sm:h-10 sm:text-xs"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
          >
            {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">New Password</label>
        <div className="relative mt-1">
          <input
            required
            type={showNew ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            placeholder="At least 8 characters"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-10 text-sm outline-none transition focus:border-violet-400 focus:bg-white sm:h-10 sm:text-xs"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
          >
            {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {form.newPassword && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
            <span className={`h-1.5 w-1.5 rounded-full ${strongEnough ? "bg-emerald-500" : "bg-slate-300"}`} />
            <span className={strongEnough ? "text-emerald-600" : "text-slate-400"}>Minimum 8 characters</span>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
        <input
          required
          type={showNew ? "text" : "password"}
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Re-enter new password"
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white sm:h-10 sm:text-xs"
        />
        {form.confirmPassword && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
            <span className={`h-1.5 w-1.5 rounded-full ${passwordsMatch ? "bg-emerald-500" : "bg-rose-400"}`} />
            <span className={passwordsMatch ? "text-emerald-600" : "text-rose-500"}>
              {passwordsMatch ? "Passwords match" : "Passwords don't match"}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={14} />
          Password changed successfully.
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:py-2.5"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default AdminProfileModal;