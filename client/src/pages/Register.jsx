import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import showCustomToast from "../utils/toast";
import { useRegisterUserMutation } from "../features/api/apiSlice";

// Romantic Love / Heart Themed Background Image
const HERO_BG_IMAGE =
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop";

const Register = () => {
  const navigate = useNavigate();
  const [registerUserApi] = useRegisterUserMutation();

  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = fullName.trim();
    const mobile = contactNumber.trim();
    const emailValue = email.trim().toLowerCase();

    // Full name validation
    if (!name) {
      const msg = "Please enter your full name.";
      setError(msg);
      showCustomToast(msg, "error", "Missing Name");
      return;
    }

    // Mobile validation
    if (!/^[0-9]{10}$/.test(mobile)) {
      const msg = "Please enter a valid 10-digit mobile number.";
      setError(msg);
      showCustomToast(msg, "error", "Invalid Mobile");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      showCustomToast(msg, "error", "Invalid Email");
      return;
    }

    // Password validation
    if (password.length < 8) {
      const msg = "Password must be at least 8 characters.";
      setError(msg);
      showCustomToast(msg, "error", "Weak Password");
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      showCustomToast(msg, "error", "Password Mismatch");
      return;
    }

    setLoading(true);

    try {
      await registerUserApi({
        fullName: name,
        contactNumber: mobile,
        email: emailValue,
        password,
      }).unwrap();

      const successMsg = "Account created successfully! Redirecting to sign in... 🎉";
      setSuccess(successMsg);
      showCustomToast(successMsg, "success", "Account Created");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      const errMsg =
        err?.data?.message || err?.message || "Registration failed. Please try again.";
      setError(errMsg);
      showCustomToast(errMsg, "error", "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8fb]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Desktop Hero Section with Background Image */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-[48%]">
          <img
            src={HERO_BG_IMAGE}
            alt="Love Romantic Background"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark / Gradient Overlay for High Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/90 via-purple-900/80 to-fuchsia-900/75 backdrop-blur-[2px]" />

          <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-12">
            <div className="max-w-lg text-center text-white">
              <div className="mb-8 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 border border-white/30 shadow-2xl backdrop-blur-md transition-transform hover:scale-105">
                  <span className="text-4xl">♥</span>
                </div>
              </div>

              <h2 className="text-4xl font-bold tracking-tight">
                Join Sathi Meet
              </h2>

              <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-white/90">
                Create your account and find your trusted companion today.
              </p>

              <div className="mx-auto mt-10 h-px w-24 bg-white/30" />

              <p className="mt-8 text-sm text-white/70">
                Your account. Your journey. Your connections.
              </p>
            </div>
          </div>

          {/* Decorative glows */}
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        </div>

        {/* Mobile Hero Section with Background Image */}
        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden px-6 py-12 lg:hidden">
          <img
            src={HERO_BG_IMAGE}
            alt="Love Romantic Background"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/85 via-purple-900/80 to-fuchsia-900/75 backdrop-blur-[2px]" />

          <div className="relative z-10 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md">
              <span className="text-3xl">♥</span>
            </div>

            <h2 className="text-2xl font-bold">
              Join Sathi Meet
            </h2>

            <p className="mt-2 text-sm text-white/85">
              Create your account &amp; find your verified companion
            </p>
          </div>
        </div>

        {/* Register Form Section */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:py-12">
          {/* Subtle Ambient Background Decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-rose-100/40 blur-3xl" />
            <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-purple-100/30 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-[420px]">
            {/* Logo */}
            <div className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2"
              >
                <span className="text-2xl font-black tracking-tight text-gray-900">
                  Sathi <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">Meet</span><span className="text-rose-500">.</span>
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Enter your details to create your new account
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-800"
                >
                  Full Name
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    👤
                  </span>

                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setError("");
                    }}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 text-sm shadow-sm transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contactNumber"
                  className="text-sm font-medium text-gray-800"
                >
                  Mobile Number
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    📱
                  </span>

                  <input
                    id="contactNumber"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="9876543210"
                    value={contactNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setContactNumber(value);
                      setError("");
                    }}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 text-sm shadow-sm transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-800"
                >
                  Email Address
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 text-sm shadow-sm transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-800"
                >
                  Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    minLength={8}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 pr-16 text-sm shadow-sm transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {password.length > 0 && password.length < 8 && (
                  <p className="text-xs text-red-500">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-800"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    🔑
                  </span>

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    minLength={8}
                    required
                    className="h-12 w-full rounded-[0.875rem] border-[1.5px] border-zinc-200 bg-white px-4 py-2 pl-11 pr-16 text-sm shadow-sm transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 hover:text-gray-700"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500">
                    Passwords do not match.
                  </p>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600 animate-fade-in">
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600 animate-fade-in">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 px-8 text-base font-semibold text-white shadow-lg shadow-rose-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/40 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Navigation Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-rose-500 transition-colors hover:text-rose-600 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Terms of Service */}
            <p className="mt-8 text-center text-[11px] leading-relaxed text-gray-400">
              By creating an account, you agree to Sathi Meet&apos;s Terms of
              Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;