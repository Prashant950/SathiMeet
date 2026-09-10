import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import showCustomToast from "../utils/toast";

import OnboardingSidebar from "../components/onboarding/OnboardingSidebar";

import BasicInfoStep from "../components/onboarding/steps/BasicInfoStep";
import InterestsStep from "../components/onboarding/steps/InterestsStep";
import PhysicalStep from "../components/onboarding/steps/PhysicalStep";
import LifestyleStep from "../components/onboarding/steps/LifestyleStep";
import LocationStep from "../components/onboarding/steps/LocationStep";
import CareerStep from "../components/onboarding/steps/CareerStep";
import PhotosStep from "../components/onboarding/steps/PhotosStep";

const ONBOARDING_STEPS = [
  {
    id: "basic",
    label: "Basic Information",
  },
  {
    id: "interests",
    label: "Interests",
  },
  {
    id: "physical",
    label: "Physical & Preferences",
  },
  {
    id: "lifestyle",
    label: "Lifestyle",
  },
  {
    id: "location",
    label: "Location",
  },
  {
    id: "career",
    label: "Career & About",
  },
  {
    id: "photos",
    label: "Photos",
  },
];

const DEFAULT_ONBOARDING_DATA = {
  age: 18,
  gender: "",
  interests: [],
  height: "",
  weight: "",
  lookingFor: [],
  ageRange: {
    min: 18,
    max: 99,
  },
  lifestyle: {
    drinking: "",
    smoking: "",
    workout: "",
    diet: "",
    pets: "",
  },
  photos: [],
  location: {
    type: "Point",
    coordinates: [0, 0],
    city: "",
    state: "",
    country: "",
    address: "",
  },
  bio: "",
  jobTitle: "",
  company: "",
  educationLevel: "",
  university: "",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const validateStep = (step, data) => {
  switch (step) {
    case "basic":
      return data.age >= 18 && !!data.gender;

    case "interests":
      return data.interests.length >= 3;

    case "physical":
      return (
        !!data.height &&
        !!data.weight &&
        data.lookingFor.length > 0
      );

    case "lifestyle":
      return Object.values(data.lifestyle).some(Boolean);

    case "location":
      return (
        data.location.coordinates[0] !== 0 ||
        data.location.coordinates[1] !== 0 ||
        !!data.location.city
      );

    case "career":
      return !!data.bio && data.bio.length >= 10;

    case "photos":
      return data.photos.length >= 1;

    default:
      return false;
  }
};

// Merge a saved profile (which may be missing keys, or come back with
// slightly different nesting from the API) safely on top of the defaults.
const mergeProfileIntoDefaults = (profile) => ({
  ...DEFAULT_ONBOARDING_DATA,
  ...profile,
  ageRange: {
    ...DEFAULT_ONBOARDING_DATA.ageRange,
    ...(profile?.ageRange || {}),
  },
  lifestyle: {
    ...DEFAULT_ONBOARDING_DATA.lifestyle,
    ...(profile?.lifestyle || {}),
  },
  location: {
    ...DEFAULT_ONBOARDING_DATA.location,
    ...(profile?.location || {}),
  },
  interests: profile?.interests || [],
  lookingFor: profile?.lookingFor || [],
  photos: profile?.photos || [],
});

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authState = useSelector((state) => state.auth);

  // Allows deep-linking straight into a section, e.g. /dashboard/onboarding?step=photos
  const requestedStep = searchParams.get("step");
  const initialStep = ONBOARDING_STEPS.some((step) => step.id === requestedStep)
    ? requestedStep
    : "basic";

  const [activeStep, setActiveStep] = useState(initialStep);

  const [data, setData] = useState(DEFAULT_ONBOARDING_DATA);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getActiveToken = () => {
    return authState?.token || localStorage.getItem("token");
  };

  // Load any previously saved profile so this screen doubles as an
  // "edit profile" flow instead of always starting from scratch.
  useEffect(() => {
    const loadProfile = async () => {
      const token = getActiveToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const profile = result.profile || result.data || result;

          if (profile && typeof profile === "object" && Object.keys(profile).length > 0) {
            setData(mergeProfileIntoDefaults(profile));
            setHasExistingProfile(true);
          }
        } else if (response.status === 401) {
          console.warn("Session expired or user deleted in DB. Redirecting to login...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Failed to load existing profile:", err);
        // Non-fatal: fall back to a blank profile so new users can still onboard.
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState?.token]);

  const updateData = (updates) => {
    setData((previous) => ({
      ...previous,
      ...updates,
    }));

    setError("");
  };

  const completedSteps = useMemo(() => {
    const completed = new Set();

    ONBOARDING_STEPS.forEach((step) => {
      if (validateStep(step.id, data)) {
        completed.add(step.id);
      }
    });

    return completed;
  }, [data]);

  const progress = Math.round(
    (completedSteps.size / ONBOARDING_STEPS.length) * 100
  );

  const currentIndex = ONBOARDING_STEPS.findIndex(
    (step) => step.id === activeStep
  );

  const isFirst = currentIndex === 0;

  const isLast =
    currentIndex === ONBOARDING_STEPS.length - 1;

  const currentStep = ONBOARDING_STEPS[currentIndex];

  const goNext = () => {
    if (!validateStep(activeStep, data)) {
      setError(
        "Please complete this step before continuing."
      );
      return;
    }

    if (!isLast) {
      setActiveStep(
        ONBOARDING_STEPS[currentIndex + 1].id
      );

      setError("");
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      setActiveStep(
        ONBOARDING_STEPS[currentIndex - 1].id
      );

      setError("");
    }
  };

  const handleStepClick = (stepId) => {
    setActiveStep(stepId);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    showCustomToast("You have been logged out successfully! 👋", "success", "Logged Out");
    navigate("/", { replace: true });
  };

  const handleSubmit = async () => {
    if (!validateStep("photos", data)) {
      setError("Please add at least one photo.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const token = getActiveToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/profile/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }
        throw new Error(
          result.message || "Failed to save profile"
        );
      }

      console.log("Profile saved successfully:", result);
      toast.success("✨ Profile saved successfully! Welcome to Sathi Meet.");

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              isProfileCompleted: true,
            })
          );
        } catch (e) {
          console.error(e);
        }
      }

      const pendingService = sessionStorage.getItem("sathi_pending_service");
      if (pendingService) {
        navigate("/services?openBuy=true", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Profile submission failed:", err);
      const errMsg = err.message || "Failed to save profile. Please try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    const props = {
      data,
      onChange: updateData,
    };

    switch (activeStep) {
      case "basic":
        return <BasicInfoStep {...props} />;

      case "interests":
        return <InterestsStep {...props} />;

      case "physical":
        return <PhysicalStep {...props} />;

      case "lifestyle":
        return <LifestyleStep {...props} />;

      case "location":
        return <LocationStep {...props} />;

      case "career":
        return <CareerStep {...props} />;

      case "photos":
        return <PhotosStep {...props} />;

      default:
        return null;
    }
  };

  // Show a lightweight loading state while we check for an existing
  // profile, so the form doesn't flash empty before filling in.
  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-950 via-purple-950 to-indigo-950">
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/10 px-8 py-10 shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
          <span className="text-4xl animate-pulse">✨</span>
          <p className="text-sm font-bold text-violet-100">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8fc] selection:bg-fuchsia-500 selection:text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="hidden lg:block lg:w-80 lg:shrink-0">
          <OnboardingSidebar
            activeStep={activeStep}
            completedSteps={completedSteps}
            progress={progress}
            onStepClick={handleStepClick}
            onLogout={handleLogout}
          />
        </div>

        <main className="flex min-h-screen flex-1 items-start justify-center px-4 py-8 sm:px-8 lg:items-center lg:px-12 lg:py-16">
          <div className="w-full max-w-3xl">
            {/* Mobile Progress Pill */}
            <div className="mb-6 lg:hidden">
              <div className="rounded-3xl bg-gradient-to-r from-violet-900 to-purple-900 p-5 text-white shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-pink-300">
                      {progress}% Complete
                    </p>
                    <p className="mt-0.5 text-xs text-violet-200">
                      Step {currentIndex + 1} of {ONBOARDING_STEPS.length}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
                  >
                    Logout
                  </button>
                </div>

                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-black/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 via-fuchsia-400 to-amber-300 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(109,40,217,0.07)] border border-violet-100/80 sm:p-10 lg:p-12">
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                    <span>✦</span>
                    {hasExistingProfile ? "Edit Profile" : "Profile Setup"}
                  </p>

                  {hasExistingProfile && (
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      ← Back to Dashboard
                    </button>
                  )}
                </div>

                <h1 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                  {hasExistingProfile
                    ? "Update your profile"
                    : "Build your profile"}
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                  {hasExistingProfile
                    ? "Jump to any section below and save your changes"
                    : "Complete the setup to unlock tailored matches & verified companion bookings"}
                </p>

                <div className="mt-6">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 transition-all duration-500 shadow-sm shadow-fuchsia-500/30"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-700">
                      {progress}% Completed
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      Step {currentIndex + 1} of {ONBOARDING_STEPS.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="min-h-[420px]">
                {renderStep()}
              </div>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={isFirst}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                >
                  ← Previous
                </button>

                <div className="text-center hidden sm:block">
                  <p className="text-xs font-semibold text-slate-400">
                    {currentStep?.label}
                  </p>
                </div>

                {!isLast ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !validateStep("photos", data)}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 px-7 py-3 text-xs sm:text-sm font-black text-white shadow-xl shadow-pink-500/25 transition hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : hasExistingProfile
                        ? "Save Changes ✦"
                        : "Complete Profile ✨"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Onboarding;