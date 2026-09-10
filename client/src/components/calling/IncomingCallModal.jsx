import React, { useEffect } from "react";
import { PhoneCall, PhoneOff, Video, Mic } from "lucide-react";

const IncomingCallModal = ({ call, onAccept, onDecline }) => {
  // Play subtle incoming call ringtone chime using Web Audio API
  useEffect(() => {
    let audioCtx = null;
    let intervalId = null;

    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      const playRingTone = () => {
        if (!audioCtx || audioCtx.state === "closed") return;
        try {
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc1.type = "sine";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
          osc2.frequency.setValueAtTime(480, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(audioCtx.destination);

          osc1.start();
          osc2.start();
          osc1.stop(audioCtx.currentTime + 1.2);
          osc2.stop(audioCtx.currentTime + 1.2);
        } catch (e) {
          // Ignore audio auto-play block
        }
      };

      playRingTone();
      intervalId = setInterval(playRingTone, 2500);
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

  if (!call) return null;

  const isVideo = call.callType === "video";

  return (
    <div className="fixed inset-0 z-[550] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-[32px] bg-slate-900 border border-slate-800 p-8 text-center text-white shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-pink-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />

        {/* Animated Radar Pulse Rings around Avatar */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-pink-500/20 animate-ping" />
          <div className="absolute h-28 w-28 rounded-full bg-pink-500/30 animate-pulse" />
          <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-pink-500 shadow-xl shadow-pink-500/40">
            <img
              src={
                call.callerPhoto ||
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300&auto=format&fit=crop"
              }
              alt={call.callerName || "Caller"}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Caller Info */}
        <h3 className="text-2xl font-black tracking-tight text-white mt-3">
          {call.callerName || "Companion"}
        </h3>
        <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-extrabold border border-pink-500/30">
          {isVideo ? (
            <>
              <Video size={13} className="animate-pulse" />
              <span>Incoming Video Call...</span>
            </>
          ) : (
            <>
              <Mic size={13} className="animate-pulse" />
              <span>Incoming Audio Call...</span>
            </>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Tap accept to join the live 1-on-1 session
        </p>

        {/* Action Buttons (Decline & Accept) */}
        <div className="mt-8 flex items-center justify-center gap-6 w-full">
          {/* Decline Button */}
          <button
            type="button"
            onClick={onDecline}
            className="cursor-pointer flex flex-col items-center gap-2 group transition active:scale-95"
          >
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-rose-600 group-hover:bg-rose-700 text-white shadow-lg shadow-rose-600/40 transition group-hover:scale-105">
              <PhoneOff size={24} />
            </div>
            <span className="text-xs font-bold text-rose-400">Decline</span>
          </button>

          {/* Accept Button */}
          <button
            type="button"
            onClick={onAccept}
            className="cursor-pointer flex flex-col items-center gap-2 group transition active:scale-95"
          >
            <div className="flex h-15 w-15 items-center justify-center rounded-full bg-emerald-500 group-hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/40 transition group-hover:scale-105 animate-bounce">
              <PhoneCall size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-400">Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
