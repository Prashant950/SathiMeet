import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  X,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  useRegisterUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../features/api/apiSlice";

export const openAuthModal = () => {
  window.dispatchEvent(new CustomEvent("sathi-auth-modal-open"));
  window.dispatchEvent(new CustomEvent("spark-auth-modal-open"));
};

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [registerUserApi, { isLoading: isRegisteringUser }] =
    useRegisterUserMutation();
  const [forgotPasswordApi, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation();
  const [resetPasswordApi, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const [localOpen, setLocalOpen] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [forgotStep, setForgotStep] = useState("email"); // "email" | "reset"

  const [loginData, setLoginData] = useState({
    emailOrMobile: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] =
    useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal open listener
  useEffect(() => {
    const handleOpen = () => setLocalOpen(true);
    window.addEventListener("sathi-auth-modal-open", handleOpen);
    window.addEventListener("spark-auth-modal-open", handleOpen);
    return () => {
      window.removeEventListener("sathi-auth-modal-open", handleOpen);
      window.removeEventListener("spark-auth-modal-open", handleOpen);
    };
  }, []);

  // Body scroll lock
  useEffect(() => {
    const shouldLockScroll = isOpen || localOpen;
    if (!shouldLockScroll) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, localOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleClose = () => {
    setLocalOpen(false);
    onClose?.();
  };

  if (!isOpen && !localOpen) return null;

  const resetState = () => {
    setMode("login");
    setForgotStep("email");
    setLoginData({ emailOrMobile: "", password: "" });
    setRegisterData({
      fullName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setForgotEmail("");
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowConfirmPassword(false);
    setShowForgotNewPassword(false);
    setShowForgotConfirmPassword(false);
    setResendTimer(0);
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    resetState();
    handleClose();
  };

  const handleOpenForgot = () => {
    setMode("forgot");
    setForgotStep("email");
    setError("");
    setSuccess("");
    // If login field has an email, prefill it
    const trimmed = loginData.emailOrMobile.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setForgotEmail(trimmed);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const value = loginData.emailOrMobile.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isMobile = /^[0-9]{10}$/.test(value);

    if (!isEmail && !isMobile) {
      setError("Please enter a valid email address or 10-digit mobile number.");
      return;
    }

    if (loginData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await signIn({
        emailOrMobile: value,
        password: loginData.password,
      });

      closeModal();
      
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
      setError(
        err?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = registerData.fullName.trim();
    const mobile = registerData.contactNumber.trim();
    const emailValue = registerData.email.trim().toLowerCase();

    if (!name) return setError("Please enter your full name.");
    if (!/^[0-9]{10}$/.test(mobile))
      return setError("Please enter a valid 10-digit mobile number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue))
      return setError("Please enter a valid email address.");
    if (registerData.password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (registerData.password !== registerData.confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);

    try {
      await registerUserApi({
        fullName: name,
        contactNumber: mobile,
        email: emailValue,
        password: registerData.password,
      }).unwrap();

      // Clear register password fields
      setRegisterData({
        fullName: "",
        contactNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Switch to Login tab with email prefilled
      setLoginData({
        emailOrMobile: emailValue,
        password: "",
      });
      setMode("login");
      setSuccess("Account created successfully! 🎉 Please enter your password to sign in.");
    } catch (err) {
      setError(
        err?.data?.message ||
        err?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    const emailValue = forgotEmail.trim().toLowerCase();
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await forgotPasswordApi({ email: emailValue }).unwrap();
      setForgotStep("reset");
      setResendTimer(60);
      setSuccess(
        response?.message ||
        "Verification code (OTP) sent to your email successfully."
      );
    } catch (err) {
      setError(
        err?.data?.message ||
        err?.message ||
        "Failed to send OTP. Please ensure this email is registered."
      );
    }
  };

  // Forgot Password: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailValue = forgotEmail.trim().toLowerCase();
    const otpValue = forgotOtp.trim();

    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter the 6-digit verification code (OTP).");
      return;
    }

    if (forgotNewPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await resetPasswordApi({
        email: emailValue,
        otp: otpValue,
        newPassword: forgotNewPassword,
      }).unwrap();

      // On successful password reset:
      setSuccess(
        response?.message ||
        "Password reset successfully! Please log in with your new password."
      );
      setMode("login");
      setLoginData({
        emailOrMobile: emailValue,
        password: "",
      });
      setForgotOtp("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
    } catch (err) {
      setError(
        err?.data?.message ||
        err?.message ||
        "Failed to reset password. Please check your OTP and try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 sm:p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/30"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Compact Top Banner */}
          <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-600 px-6 py-6 text-white">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {mode === "forgot" ? (
                <>
                  Reset <span className="text-fuchsia-300">Password</span>
                </>
              ) : (
                <>
                  Welcome to <span className="text-fuchsia-300">Sathi Meet</span>
                </>
              )}
            </h2>
            <p className="mt-1 text-xs font-medium text-violet-100/90 sm:text-sm">
              {mode === "forgot"
                ? forgotStep === "email"
                  ? "Enter your email to receive a recovery OTP"
                  : "Enter the OTP and create your new password"
                : "India's #1 social & lifestyle support platform"}
            </p>
          </div>

          {/* Mode Switcher (Visible in Login and Register Modes) */}
          {mode !== "forgot" && (
            <div className="bg-slate-50 px-6 pt-5 pb-2">
              <div className="relative flex rounded-2xl bg-slate-200/80 p-1.5 shadow-inner">
                {/* Animated Active Pill with Violet Color */}
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-violet-600 shadow-md shadow-violet-300 transition-all duration-300 ease-out ${mode === "register"
                      ? "translate-x-[calc(100%+6px)]"
                      : "translate-x-0"
                    }`}
                />

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
                  className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors duration-200 ${mode === "login"
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccess("");
                  }}
                  className={`relative z-10 w-1/2 py-2.5 text-sm font-bold transition-colors duration-200 ${mode === "register"
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-slate-50 px-6 pb-6 pt-3">
            {/* Error Banner */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <span>{success}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Phone or Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="text"
                      value={loginData.emailOrMobile}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          emailOrMobile: e.target.value,
                        })
                      }
                      placeholder="Mobile number or email"
                      maxLength={254}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="Your password"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleOpenForgot}
                    className="text-xs font-semibold text-violet-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !loginData.emailOrMobile ||
                    loginData.password.length < 8
                  }
                  className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-violet-600 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      value={registerData.contactNumber}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          contactNumber: e.target.value,
                        })
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      placeholder="you@example.com"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      placeholder="At least 8 characters"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm password"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !registerData.fullName ||
                    !registerData.contactNumber ||
                    !registerData.email ||
                    !registerData.password ||
                    !registerData.confirmPassword
                  }
                  className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-violet-600 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Register"}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FLOW */}
            {mode === "forgot" && (
              <div className="space-y-4">
                {/* STEP 1: Enter Email & Send OTP */}
                {forgotStep === "email" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="you@example.com"
                          required
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        We will send a 6-digit verification code to your email.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingOtp || !forgotEmail}
                      className="h-11 w-full cursor-pointer rounded-xl bg-violet-600 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSendingOtp ? "Sending Code..." : "Send Verification Code"}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setError("");
                          setSuccess("");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 transition"
                      >
                        <ArrowLeft size={14} /> Back to Login
                      </button>
                    </div>
                  </form>
                ) : (
                  /* STEP 2: Enter OTP, New Password & Confirm Password */
                  <form onSubmit={handleResetPassword} className="space-y-3.5">
                    {/* Current Email Display */}
                    <div className="flex items-center justify-between rounded-xl bg-violet-50/80 border border-violet-100 px-3.5 py-2">
                      <div className="truncate text-xs text-slate-700">
                        <span className="font-semibold text-violet-900">Email:</span>{" "}
                        {forgotEmail}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep("email");
                          setError("");
                        }}
                        className="text-xs font-semibold text-violet-600 hover:underline shrink-0 ml-2"
                      >
                        Change
                      </button>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-700">
                          6-Digit OTP Code
                        </label>
                        {resendTimer > 0 ? (
                          <span className="text-[11px] text-slate-400">
                            Resend in {resendTimer}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendOtp()}
                            disabled={isSendingOtp}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 hover:underline disabled:opacity-50"
                          >
                            <RotateCcw size={11} /> Resend OTP
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <ShieldCheck size={16} />
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={forgotOtp}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setForgotOtp(val);
                            setError("");
                          }}
                          placeholder="Enter 6-digit OTP"
                          required
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold tracking-widest text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        New Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <Lock size={16} />
                        </span>
                        <input
                          type={showForgotNewPassword ? "text" : "password"}
                          value={forgotNewPassword}
                          onChange={(e) => {
                            setForgotNewPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="At least 8 characters"
                          minLength={8}
                          required
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowForgotNewPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showForgotNewPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <KeyRound size={16} />
                        </span>
                        <input
                          type={showForgotConfirmPassword ? "text" : "password"}
                          value={forgotConfirmPassword}
                          onChange={(e) => {
                            setForgotConfirmPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Confirm new password"
                          minLength={8}
                          required
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowForgotConfirmPassword((prev) => !prev)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showForgotConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isResettingPassword ||
                        forgotOtp.length !== 6 ||
                        forgotNewPassword.length < 8 ||
                        forgotNewPassword !== forgotConfirmPassword
                      }
                      className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-violet-600 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResettingPassword
                        ? "Resetting Password..."
                        : "Reset Password & Login"}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setError("");
                          setSuccess("");
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 transition"
                      >
                        <ArrowLeft size={14} /> Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
