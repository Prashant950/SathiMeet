import React from "react";
import toast from "react-hot-toast";

/**
 * Universal Custom Toast Notification matching modern card design:
 * - White card with soft elevation shadow
 * - Left vertical green accent bar (or red for error)
 * - Bold title + subtle gray subtitle description
 * - Top-Right position
 */
export const showCustomToast = (message, type = "default", customTitle) => {
  if (!message) return;

  const isError =
    type === "error" ||
    message.includes("❌") ||
    message.includes("⚠️") ||
    message.toLowerCase().includes("failed") ||
    message.toLowerCase().includes("error") ||
    message.toLowerCase().includes("declined");

  const isSuccess =
    !isError &&
    (type === "success" ||
      message.includes("✅") ||
      message.includes("🎉") ||
      message.includes("💖") ||
      message.includes("⭐") ||
      message.includes("👋") ||
      message.includes("☁️") ||
      message.toLowerCase().includes("success"));

  const defaultTitle = customTitle
    ? customTitle
    : isError
    ? "Notice"
    : isSuccess
    ? "Success"
    : "Notification";

  const cleanMsg = message;

  return toast.custom(
    (t) => (
      <div
        className={`max-w-sm w-full bg-white rounded-xl pointer-events-auto flex items-center justify-between border border-slate-100/90 transition-all duration-200 ${
          t.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        } ${
          isError
            ? "border-l-[6px] border-l-rose-500"
            : "border-l-[6px] border-l-emerald-500"
        }`}
        style={{
          boxShadow:
            "0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex-1 py-3 px-4 flex flex-col justify-center min-w-0">
          <p className="text-[13.5px] font-extrabold text-slate-900 leading-tight truncate">
            {defaultTitle}
          </p>
          <p className="text-[12px] text-slate-500 font-medium mt-0.5 leading-snug break-words">
            {cleanMsg}
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          className="cursor-pointer px-3 text-slate-300 hover:text-slate-600 transition text-sm font-bold"
          aria-label="Close toast"
        >
          ✕
        </button>
      </div>
    ),
    {
      duration: 3500,
      position: "top-right",
    }
  );
};

export const customToast = {
  success: (msg, title = "Success") => showCustomToast(msg, "success", title),
  error: (msg, title = "Notice") => showCustomToast(msg, "error", title),
  info: (msg, title = "Notification") => showCustomToast(msg, "default", title),
};

export default showCustomToast;
