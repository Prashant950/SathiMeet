import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ShieldCheck, PhoneOff, AlertCircle, Loader2 } from "lucide-react";

const CallContainer = ({
  roomID,
  userID,
  userName = "User",
  userPhoto,
  companionName = "Companion",
  companionPhoto,
  callType = "video",
  onEndCall,
}) => {
  const containerRef = useRef(null);
  const zpRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [permissionError, setPermissionError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initZego = async () => {
      try {
        if (!containerRef.current) return;

        const appID = Number(import.meta.env.VITE_ZEGO_APP_ID || 1344685003);
        const serverSecret = String(
          import.meta.env.VITE_ZEGO_APP_SERVER_SECRET || "01d9dd7f23b2d090bda478ebe9887d66"
        );

        if (!roomID || !userID) {
          if (isMounted) {
            setPermissionError("Call session credentials missing. Please try again.");
            setIsConnecting(false);
          }
          return;
        }

        const safeRoomID = String(roomID).trim();
        const safeUserID = String(userID).trim().replace(/[^a-zA-Z0-9_-]/g, "_");
        const safeUserName = String(userName || "User").trim();

        // 1. Generate Kit Token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          safeRoomID,
          safeUserID,
          safeUserName
        );

        // 2. Create Zego instance
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        // 3. Join Call Room
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: callType === "video",
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: false,
          showTextChat: false,
          showUserList: false,
          showRoomTimer: true,
          showLeavingView: false,
          showLeaveRoomConfirmDialog: false,
          showNonVideoUser: true,
          showOnlyAudioUser: true,
          layout: "Auto",
          videoScreenConfig: {
            objectFit: "cover",
            localMirror: true,
            pullStreamMirror: false,
          },
          // Set Avatars for both users when camera is off
          onUserAvatarSetter: (users) => {
            if (Array.isArray(users)) {
              users.forEach((u) => {
                if (u.userID === safeUserID) {
                  if (userPhoto && u.setUserAvatar) u.setUserAvatar(userPhoto);
                } else {
                  if (companionPhoto && u.setUserAvatar) u.setUserAvatar(companionPhoto);
                }
              });
            }
          },
          // Instant Real-Time Call Cut on Both Sides
          onLeaveRoom: () => {
            if (onEndCall) onEndCall();
          },
          onReturnToHomeScreenClicked: () => {
            if (onEndCall) onEndCall();
          },
          onUserLeave: () => {
            // When the companion leaves or cuts the call, immediately hang up this side too
            if (onEndCall) onEndCall();
          },
          onYouRemovedFromRoom: () => {
            if (onEndCall) onEndCall();
          },
          onInRoomCommandReceived: (fromUser, command) => {
            if (command === "CALL_ENDED") {
              if (onEndCall) onEndCall();
            }
          },
        });

        if (isMounted) {
          setIsConnecting(false);
        }
      } catch (err) {
        console.error("Zego Call Join Error:", err);
        if (isMounted) {
          setPermissionError("Could not start audio/video call. Please verify microphone & camera permissions.");
          setIsConnecting(false);
        }
      }
    };

    initZego();

    return () => {
      isMounted = false;
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (e) {
          console.error("Error destroying Zego instance:", e);
        }
        zpRef.current = null;
      }
    };
  }, [roomID, userID, userName, userPhoto, companionPhoto, callType, onEndCall]);

  const handleManualLeave = async () => {
    try {
      if (zpRef.current) {
        zpRef.current.sendInRoomCommand("CALL_ENDED", []).catch(() => {});
      }
    } catch (e) {}
    if (onEndCall) onEndCall();
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop";
  const avatarUrl = companionPhoto || defaultAvatar;

  return (
    <div className="fixed inset-0 z-[600] bg-[#0c1317] text-white flex flex-col justify-between select-none overflow-hidden animate-in fade-in">
      
      {/* Custom Styles to make Zego Camera Off View look like Instagram / WhatsApp center circular avatar with glowing sound wave rings */}
      <style>{`
        @keyframes instaSoundRipple {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 168, 132, 0.8), 0 0 0 0 rgba(0, 168, 132, 0.5);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 22px rgba(0, 168, 132, 0.25), 0 0 0 44px rgba(0, 168, 132, 0.08);
            transform: scale(1.03);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 168, 132, 0), 0 0 0 0 rgba(0, 168, 132, 0);
            transform: scale(1);
          }
        }

        .zego-custom-call-container {
          width: 100% !important;
          height: 100% !important;
          background-color: #0c1317 !important;
        }

        /* Container background when video off */
        .zego-custom-call-container div[class*="videoPlayerWrapper"] {
          background-color: #0c1317 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Camera Off Mask: clean centered avatar, not full screen zoom */
        .zego-custom-call-container div[class*="cameraMask"] {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background-color: #0c1317 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 10 !important;
        }

        /* Circular Avatar in Center with Instagram Vibrating Sound Ripple effect */
        .zego-custom-call-container div[class*="cameraMask"] > img {
          position: relative !important;
          width: 130px !important;
          height: 130px !important;
          min-width: 130px !important;
          min-height: 130px !important;
          max-width: 130px !important;
          max-height: 130px !important;
          border-radius: 9999px !important;
          object-fit: cover !important;
          border: 4px solid #00a884 !important;
          animation: instaSoundRipple 2.2s infinite ease-in-out !important;
        }

        /* Letter avatar fallback */
        .zego-custom-call-container div[class*="cameraMask"] > div {
          position: relative !important;
          width: 130px !important;
          height: 130px !important;
          border-radius: 9999px !important;
          line-height: 130px !important;
          font-size: 48px !important;
          font-weight: 800 !important;
          text-align: center !important;
          background-color: #1f2c34 !important;
          color: #00a884 !important;
          border: 4px solid #00a884 !important;
          animation: instaSoundRipple 2.2s infinite ease-in-out !important;
        }
      `}</style>

      {/* Top Header Bar */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden ring-2 ring-[#00a884]">
            <img
              src={avatarUrl}
              alt={companionName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>{companionName}</span>
              <span className="flex h-2 w-2 rounded-full bg-[#00a884] animate-pulse" />
            </h3>
            <p className="text-[11px] font-semibold text-[#00a884] flex items-center gap-1.5">
              <span>{callType === "video" ? "HD Video Call" : "HD Audio Call"}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80 font-normal">Live Connected</span>
            </p>
          </div>
        </div>

        {/* Security Pill & Quick End Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-white/80 font-medium">
            <ShieldCheck size={14} className="text-[#00a884]" />
            <span>End-to-end encrypted</span>
          </div>
          
          <button
            type="button"
            onClick={handleManualLeave}
            className="cursor-pointer flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-md active:scale-95"
            title="Leave Call"
          >
            <PhoneOff size={14} />
            <span>Leave</span>
          </button>
        </div>
      </div>

      {/* Main ZEGOCLOUD Video/Audio Meeting Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-[#0c1317]">
        {/* Loading Indicator while connecting */}
        {isConnecting && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
            <Loader2 className="h-10 w-10 text-[#00a884] animate-spin" />
            <p className="text-sm font-semibold text-slate-300">
              Connecting audio & video stream with {companionName}...
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {permissionError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 p-6 text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 text-rose-500">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Media Stream Error</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              {permissionError}
            </p>
            <button
              type="button"
              onClick={handleManualLeave}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
            >
              Close Call
            </button>
          </div>
        )}

        {/* The DOM element Zego UIKit attaches to */}
        <div
          ref={containerRef}
          className="zego-custom-call-container w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

    </div>
  );
};

export default CallContainer;
