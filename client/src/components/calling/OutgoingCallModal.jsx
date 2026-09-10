import React, { useEffect } from "react";
import { PhoneOff, Video, Mic } from "lucide-react";

const OutgoingCallModal = ({
  companionName,
  companionPhoto,
  callType = "video",
  onCancel,
}) => {
  // Dial tone simulation
  useEffect(() => {
    let audioCtx = null;
    let intervalId = null;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      const playDialTone = () => {
        if (!audioCtx || audioCtx.state === "closed") return;
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(425, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 1.0);
        } catch (e) {}
      };

      playDialTone();
      intervalId = setInterval(playDialTone, 2800);
    } catch (e) {}

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx && audioCtx.state !== "closed") {
        try {
          audioCtx.close();
        } catch (e) {}
      }
    };
  }, []);

  const isVideo = callType === "video";

  return (
    <div className="fixed inset-0 z-[550] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-[32px] bg-slate-900 border border-slate-800 p-8 text-center text-white shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-pink-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />

        {/* Pulsing Avatar */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-pink-500/20 animate-ping" />
          <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-pink-500 shadow-xl shadow-pink-500/40">
            <img
              src={
                companionPhoto ||
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300&auto=format&fit=crop"
              }
              alt={companionName || "Companion"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Companion Details */}
        <h3 className="text-2xl font-black tracking-tight text-white mt-3">
          {companionName || "Companion"}
        </h3>

        <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-extrabold border border-pink-500/30">
          {isVideo ? (
            <>
              <Video size={13} className="animate-pulse" />
              <span>Outgoing HD Video Call</span>
            </>
          ) : (
            <>
              <Mic size={13} className="animate-pulse" />
              <span>Outgoing Audio Call</span>
            </>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 justify-center">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Ringing companion's device...</span>
        </p>

        {/* Cancel Button */}
        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer flex flex-col items-center gap-2 group transition active:scale-95"
          >
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-rose-600 group-hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition group-hover:scale-105">
              <PhoneOff size={24} />
            </div>
            <span className="text-xs font-bold text-rose-400">Cancel Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCallModal;
