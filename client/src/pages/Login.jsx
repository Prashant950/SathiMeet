import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import showCustomToast from "../utils/toast";
import { useAuth } from "../hooks/useAuth";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft,
  RotateCcw,
  Sparkles
} from "lucide-react";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../features/api/apiSlice";

const HERO_BG_IMAGE =
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [forgotPasswordApi, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPasswordApi, { isLoading: isResettingPassword }] = useResetPasswordMutation();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal states
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "reset"
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const value = emailOrMobile.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isMobile = /^[0-9]{10}$/.test(value);

    if (!isEmail && !isMobile) {
      const msg = "Please enter a valid email address or 10-digit mobile number.";
      setError(msg);
      showCustomToast(msg, "error", "Invalid Input");
      return;
    }

    if (password.length < 8) {
      const msg = "Password must be at least 8 characters.";
      setError(msg);
      showCustomToast(msg, "error", "Password Error");
      return;
    }

    setLoading(true);

    try {
      const data = await signIn({
        emailOrMobile: value,
        password,
      });

      showCustomToast("Welcome back! Signed in successfully. 🎉", "success", "Welcome Back");

      if (data?.user?.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      const pendingService = sessionStorage.getItem("sathi_pending_service");
      if (pendingService && data?.user?.isProfileCompleted) {
        navigate("/services?openBuy=true", { replace: true });
        return;
      }

      if (!data?.user?.isProfileCompleted) {
        navigate("/dashboard/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Invalid credentials. Please check your email/phone and password.";
      setError(errMsg);
      showCustomToast(errMsg, "error", "Sign In Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setSuccess("");
    const emailVal = forgotEmail.trim().toLowerCase();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const res = await forgotPasswordApi({ email: emailVal }).unwrap();
      setForgotStep("reset");
      setResendTimer(60);
      setSuccess(res?.message || "Verification code (OTP) sent to your email.");
    } catch (err) {
      setError(err?.data?.message || err?.message || "Failed to send OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (forgotOtp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (forgotNewPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await resetPasswordApi({
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword,
      }).unwrap();

      setSuccess(res?.message || "Password reset successfully! Please sign in.");
      setIsForgotModalOpen(false);
      setEmailOrMobile(forgotEmail);
    } catch (err) {
      setError(err?.data?.message || err?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8fb]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Desktop Hero Section with Background Image */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-[48%]">
          <img
            src={HERO_BG_IMAGE}
            alt="Sathi Meet Romance"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/90 via-purple-900/80 to-fuchsia-900/75 backdrop-blur-[2px]" />

          <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-12">
            <div className="max-w-lg text-center text-white">
              <div className="mb-8 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 border border-white/30 shadow-2xl backdrop-blur-md transition-transform hover:scale-105">
                  <span className="text-4xl">♥</span>
                </div>
              </div>

              <h2 className="text-4xl font-black tracking-tight">
                Welcome to Sathi Meet
              </h2>

              <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-white/90">
                Discover meaningful matches, casual companions, and lifestyle partners.
              </p>

              <div className="mx-auto mt-10 h-px w-24 bg-white/30" />

              <p className="mt-8 text-sm text-white/70">
                Your account. Your verified connections.
              </p>
            </div>
          </div>

          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        </div>

        {/* Mobile Hero */}
        <div className="relative flex min-h-[200px] items-center justify-center overflow-hidden px-6 py-10 lg:hidden">
          <img
            src={HERO_BG_IMAGE}
            alt="Hero Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/85 via-purple-900/80 to-fuchsia-900/75 backdrop-blur-[2px]" />

          <div className="relative z-10 text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md">
              <span className="text-2xl">♥</span>
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="mt-1 text-xs text-white/85">Sign in to your Sathi Meet account</p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:py-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-pink-100/40 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-purple-100/30 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-[420px]">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-gray-900">
                  Sathi <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Meet</span><span className="text-rose-500">.</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                User Sign In
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Enter your registered mobile number or email to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Mobile */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter mobile or email"
                    value={emailOrMobile}
                    onChange={(e) => {
                      setEmailOrMobile(e.target.value);
                      setError("");
                    }}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 text-sm shadow-sm transition hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-800">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setForgotStep("email");
                      setError("");
                      setSuccess("");
                    }}
                    className="cursor-pointer text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    minLength={8}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 pr-12 text-sm shadow-sm transition hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-xs sm:text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !emailOrMobile || password.length < 8}
                className="cursor-pointer mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 px-8 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Navigation to Register & Admin */}
            <div className="mt-8 space-y-3 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-rose-500 hover:text-rose-600 hover:underline"
                >
                  Create Account
                </Link>
              </p>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/admin-login"
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Are you an Admin? Login to Admin Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              {forgotStep === "email" ? "Reset Password" : "Create New Password"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {forgotStep === "email"
                ? "Enter your registered email to receive an OTP."
                : "Enter the OTP code received and set your new password."}
            </p>

            {forgotStep === "email" ? (
              <form onSubmit={handleSendOtp} className="mt-4 space-y-4">
                <input
                  type="email"
                  placeholder="Enter registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-rose-400"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingOtp || !forgotEmail}
                    className="w-1/2 rounded-xl bg-pink-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-pink-700 disabled:opacity-50"
                  >
                    {isSendingOtp ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="mt-4 space-y-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-bold tracking-widest outline-none focus:border-rose-400"
                />
                <input
                  type="password"
                  placeholder="New password (min 8 chars)"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  minLength={8}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-rose-400"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-rose-400"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep("email")}
                    className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="w-1/2 rounded-xl bg-pink-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-pink-700 disabled:opacity-50"
                  >
                    {isResettingPassword ? "Resetting..." : "Save Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
