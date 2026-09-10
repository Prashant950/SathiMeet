import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import showCustomToast from "../utils/toast";
import {
  Flame,
  Heart,
  MessageSquare,
  User,
  LogOut,
  MapPin,
  Briefcase,
  Sparkles,
  Search,
  CheckCircle2,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Crown,
  Bell,
  Bookmark,
  Settings,
  Send,
  Plus,
  Compass,
  Zap,
  Calendar,
  CreditCard,
  Phone,
  Video,
  Smile,
  CheckCheck,
  Menu,
  Clock,
  ArrowRight,
  Sliders,
  Check,
  Edit3,
  Save,
  Trash2,
  Camera,
  GraduationCap,
  Loader2,
  UploadCloud,
  FileText,
  Download,
  Paperclip
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import CallContainer from "../components/calling/CallContainer";
import IncomingCallModal from "../components/calling/IncomingCallModal";
import OutgoingCallModal from "../components/calling/OutgoingCallModal";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadImageMutation,
  useGetDiscoveryProfilesQuery,
  useGetMatchesAndLikesQuery,
  useSwipeProfileMutation,
  useLikeBackMutation,
  useGetConversationsQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useGetOrCreateConversationWithUserMutation,
  useGetMyPurchasedServicesQuery,
  useGetUserPaymentsQuery,
  useStartCallMutation,
  useGetIncomingCallQuery,
  useGetCallStatusQuery,
  useRespondCallMutation,
  useEndCallMutation,
} from "../features/api/apiSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Full Tinder Swipe Card for Discover Tab
const FullSwipeCard = ({ profile, onSwipe, isTop }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -90], [0, 1]);
  const superLikeOpacity = useTransform(y, [-20, -90], [0, 1]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 110) {
      onSwipe("right", profile._id || profile.userId);
    } else if (info.offset.x < -110) {
      onSwipe("left", profile._id || profile.userId);
    } else if (info.offset.y < -110) {
      onSwipe("up", profile._id || profile.userId);
    }
  };

  const displayName = profile.name || profile.fullName || "Companion";
  const displayPhoto = profile.photo || profile.photos?.[0] || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop";

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
      }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ scale: isTop ? 1 : 0.96 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl border border-slate-700/50"
    >
      <img
        src={displayPhoto}
        alt={displayName}
        className="h-full w-full object-cover pointer-events-none"
      />

      {isTop && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-30 -rotate-12 rounded-2xl border-4 border-emerald-400 bg-emerald-500/20 px-4 py-1.5 text-2xl font-black uppercase text-emerald-400 backdrop-blur-sm shadow-xl"
          >
            LIKE 💖
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 z-30 rotate-12 rounded-2xl border-4 border-rose-500 bg-rose-500/20 px-4 py-1.5 text-2xl font-black uppercase text-rose-400 backdrop-blur-sm shadow-xl"
          >
            PASS ✖
          </motion.div>
          <motion.div
            style={{ opacity: superLikeOpacity }}
            className="absolute bottom-32 inset-x-0 mx-auto w-max z-30 rounded-2xl border-4 border-amber-400 bg-amber-500/20 px-5 py-1.5 text-2xl font-black uppercase text-amber-300 backdrop-blur-sm shadow-xl"
          >
            SUPER LIKE ⭐
          </motion.div>
        </>
      )}

      {/* Bottom Profile Details */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-7 text-white pointer-events-none">
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl sm:text-3xl font-black">{displayName}, {profile.age || 24}</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-xs text-white">
            ✓
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3.5 text-sm font-semibold text-slate-300">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} className="text-pink-400" /> {profile.city || "Mumbai, India"}
          </span>
          {profile.job && (
            <span className="flex items-center gap-1.5">
              <Briefcase size={15} className="text-violet-400" /> {profile.job || profile.jobTitle}
            </span>
          )}
        </div>

        <p className="mt-2.5 text-sm text-slate-200 line-clamp-2 leading-relaxed">
          {profile.bio || "Looking to meet meaningful companions on Sathi Meet."}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {(profile.tags || profile.interests || ["Travel", "Coffee"]).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/20 border border-white/25 px-3 py-1 text-xs font-bold text-white backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signOut } = useAuth();
  const authState = useSelector((state) => state.auth);

  const storedUser = localStorage.getItem("user");
  let user = authState?.user || null;
  if (!user && storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error(e);
    }
  }

  // Active Sidebar Tab State
  const initialTab = searchParams.get("tab") || "dashboard";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mobile Menu Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [matchedCelebrationModal, setMatchedCelebrationModal] = useState(null);
  const [previewProfileModal, setPreviewProfileModal] = useState(null);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0);

  // 1. RTK Query Real Endpoints with Live Polling
  const { data: profileData } = useGetMyProfileQuery(undefined, { skip: !authState?.token });
  const profile = profileData?.profile || profileData?.data || profileData || null;

  const { data: discoveryData, refetch: refetchDiscovery } = useGetDiscoveryProfilesQuery(undefined, {
    skip: !authState?.token,
    pollingInterval: 5000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: matchesLikesData, refetch: refetchMatchesLikes } = useGetMatchesAndLikesQuery(undefined, {
    skip: !authState?.token,
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: conversationsData, refetch: refetchConversations } = useGetConversationsQuery(undefined, {
    skip: !authState?.token,
    pollingInterval: 2000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { data: myServicesData, refetch: refetchMyServices, isLoading: isLoadingServices } = useGetMyPurchasedServicesQuery(undefined, {
    skip: !authState?.token,
    pollingInterval: 5000,
    refetchOnFocus: true,
  });

  const { data: myPaymentsData, refetch: refetchMyPayments, isLoading: isLoadingPayments } = useGetUserPaymentsQuery(undefined, {
    skip: !authState?.token,
    pollingInterval: 5000,
    refetchOnFocus: true,
  });

  const purchasedServices = useMemo(() => myServicesData?.data || [], [myServicesData]);
  const totalSpent = useMemo(() => myServicesData?.totalSpent || 0, [myServicesData]);
  const myPayments = useMemo(() => myPaymentsData?.data || [], [myPaymentsData]);

  const [swipeProfileMutation] = useSwipeProfileMutation();
  const [likeBackMutation] = useLikeBackMutation();
  const [sendMessageMutation] = useSendMessageMutation();
  const [markConversationReadMutation] = useMarkConversationReadMutation();
  const [getOrCreateConversationWithUserMutation] = useGetOrCreateConversationWithUserMutation();
  const [updateMyProfileMutation, { isLoading: isSavingProfile }] = useUpdateMyProfileMutation();
  const [uploadImageMutation, { isLoading: isUploadingPhoto }] = useUploadImageMutation();

  // Calling State
  const [activeCallSession, setActiveCallSession] = useState(null); // { roomID, callId, companionName, companionPhoto, callType }
  const [outgoingCall, setOutgoingCall] = useState(null); // { callId, roomID, companionName, companionPhoto, callType }

  const [startCallMutation] = useStartCallMutation();
  const [respondCallMutation] = useRespondCallMutation();
  const [endCallMutation] = useEndCallMutation();

  // Poll for incoming calls every 700ms for instant real-time ringing
  const { data: incomingCallData } = useGetIncomingCallQuery(undefined, {
    skip: !authState?.token || !!activeCallSession || !!outgoingCall,
    pollingInterval: 700,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Track outgoing or active call status every 600ms in real-time
  const trackedCallId = outgoingCall?.callId || activeCallSession?.callId;
  const { data: callStatusData } = useGetCallStatusQuery(trackedCallId, {
    skip: !trackedCallId,
    pollingInterval: 600,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Listen for call status changes (acceptance, decline, cancel, or remote hangup)
  useEffect(() => {
    if (!callStatusData?.call) return;
    const call = callStatusData.call;

    // 1. Handling Outgoing Call States
    if (outgoingCall) {
      if (call.status === "accepted") {
        setActiveCallSession({
          roomID: call.roomID,
          callId: call._id,
          companionName: outgoingCall.companionName,
          companionPhoto: outgoingCall.companionPhoto,
          callType: outgoingCall.callType,
        });
        setOutgoingCall(null);
      } else if (call.status === "declined") {
        setOutgoingCall(null);
        showToast(`📞 ${outgoingCall.companionName} declined the call.`);
        refetchConversations();
      } else if (call.status === "missed") {
        setOutgoingCall(null);
        showToast(`📞 No answer from ${outgoingCall.companionName}.`);
        refetchConversations();
      } else if (call.status === "cancelled" || call.status === "ended") {
        setOutgoingCall(null);
        refetchConversations();
      }
    }

    // 2. Handling Active In-Call Remote Hangup (when either party ends the call)
    if (activeCallSession && (call.status === "ended" || call.status === "cancelled")) {
      setActiveCallSession(null);
      showToast("📞 Call ended");
      refetchConversations();
    }
  }, [callStatusData, outgoingCall, activeCallSession, refetchConversations]);

  const handleInitiateCall = async (companion, callType = "video") => {
    const targetId =
      companion?.otherUserId ||
      companion?.userId ||
      companion?.user?._id ||
      companion?._id ||
      companion?.id;

    if (!targetId) {
      showToast("⚠️ Could not find companion details to initiate call");
      return;
    }

    try {
      showToast(`📞 Calling ${companion.name || companion.fullName || "Companion"}...`);
      const res = await startCallMutation({ receiverId: targetId, callType }).unwrap();
      if (res?.call) {
        setOutgoingCall({
          callId: res.call._id,
          roomID: res.call.roomID,
          companionName: companion.name || companion.fullName || "Companion",
          companionPhoto: companion.photo || companion.photos?.[0],
          callType,
        });
        refetchConversations();
      }
    } catch (err) {
      showToast("❌ Could not initiate call. Please try again.");
    }
  };

  const handleAcceptIncomingCall = async () => {
    const incCall = incomingCallData?.incomingCall;
    if (!incCall) return;

    try {
      await respondCallMutation({ callId: incCall._id, action: "accept" }).unwrap();
      setActiveCallSession({
        roomID: incCall.roomID,
        callId: incCall._id,
        companionName: incCall.callerName,
        companionPhoto: incCall.callerPhoto,
        callType: incCall.callType,
      });
      refetchConversations();
    } catch (err) {
      showToast("❌ Could not connect call");
    }
  };

  const handleDeclineIncomingCall = async () => {
    const incCall = incomingCallData?.incomingCall;
    if (!incCall) return;

    try {
      await respondCallMutation({ callId: incCall._id, action: "decline" }).unwrap();
      showToast("Call declined");
      refetchConversations();
    } catch (err) {}
  };

  const handleCancelOutgoingCall = async () => {
    if (outgoingCall?.callId) {
      try {
        await respondCallMutation({ callId: outgoingCall.callId, action: "cancel" }).unwrap();
      } catch (e) {}
    }
    setOutgoingCall(null);
    refetchConversations();
  };

  const handleEndActiveCall = async () => {
    if (activeCallSession?.callId) {
      try {
        await endCallMutation({ callId: activeCallSession.callId }).unwrap();
      } catch (e) {}
    }
    setActiveCallSession(null);
    showToast("Call ended");
    refetchConversations();
  };

  const photoFileInputRef = useRef(null);

  // Extract Real Conversations and Total Unread Count
  const allConversations = useMemo(() => conversationsData?.conversations || [], [conversationsData]);
  const totalUnreadCount = conversationsData?.totalUnreadCount || 0;

  // Local state for real discover feed deck with real-time append
  const [discoverList, setDiscoverList] = useState([]);

  useEffect(() => {
    if (discoveryData?.profiles) {
      setDiscoverList(discoveryData.profiles);
    }
  }, [discoveryData]);

  // Extract Real Likes and Matches from Backend
  const realLikes = useMemo(() => matchesLikesData?.likesMe || [], [matchesLikesData]);
  const realMatches = useMemo(() => matchesLikesData?.mutualMatches || [], [matchesLikesData]);
  const likesCount = matchesLikesData?.likesCount ?? realLikes.length;
  const matchesCount = matchesLikesData?.matchesCount ?? realMatches.length;

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    age: 24,
    gender: "Female",
    city: "Mumbai, India",
    jobTitle: "",
    company: "",
    educationLevel: "",
    university: "",
    height: "5'6\"",
    weight: "55 kg",
    bio: "",
    interests: [],
    lookingFor: [],
    lifestyle: {
      drinking: "Socially",
      smoking: "Never",
      workout: "Regularly",
      diet: "Flexible",
      pets: "Pet friendly",
    },
    photos: [],
  });

  // Sync profile data into edit form
  useEffect(() => {
    if (profile || user) {
      setEditFormData({
        fullName: user?.fullName || profile?.fullName || "",
        email: user?.email || profile?.email || "",
        contactNumber: user?.contactNumber || profile?.contactNumber || "",
        age: profile?.age || 24,
        gender: profile?.gender || "Female",
        city: profile?.location?.city || "Mumbai, India",
        jobTitle: profile?.jobTitle || "",
        company: profile?.company || "",
        educationLevel: profile?.educationLevel || "",
        university: profile?.university || "",
        height: profile?.height || "5'6\"",
        weight: profile?.weight || "55 kg",
        bio: profile?.bio || "Living each day with curiosity, music, and looking for genuine companion connections on Sathi Meet.",
        interests: profile?.interests?.length ? profile.interests : ["Travel", "Coffee", "Music", "Photography", "Fitness"],
        lookingFor: profile?.lookingFor?.length ? profile.lookingFor : ["Meaningful Connection", "Companion Meetups"],
        lifestyle: {
          drinking: profile?.lifestyle?.drinking || "Socially",
          smoking: profile?.lifestyle?.smoking || "Never",
          workout: profile?.lifestyle?.workout || "Regularly",
          diet: profile?.lifestyle?.diet || "Flexible",
          pets: profile?.lifestyle?.pets || "Pet friendly",
        },
        photos: profile?.photos?.length ? profile.photos : [
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop"
        ],
      });
    }
  }, [profile, user]);

  const handleAddInterest = (tagToAdd) => {
    const trimmed = (tagToAdd || newTagInput).trim();
    if (trimmed && !editFormData.interests.includes(trimmed)) {
      setEditFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
      setNewTagInput("");
    }
  };

  const handleRemoveInterest = (tagToRemove) => {
    setEditFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((t) => t !== tagToRemove),
    }));
  };

  const handleToggleLookingFor = (option) => {
    setEditFormData((prev) => {
      const exists = prev.lookingFor.includes(option);
      return {
        ...prev,
        lookingFor: exists
          ? prev.lookingFor.filter((o) => o !== option)
          : [...prev.lookingFor, option],
      };
    });
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setEditFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, newPhotoUrl.trim()],
      }));
      setNewPhotoUrl("");
    }
  };

  const handleRemovePhoto = (index) => {
    setEditFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleUploadFileToCloudinary = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("❌ Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await uploadImageMutation({ image: reader.result }).unwrap();
          if (res?.url) {
            setEditFormData((prev) => ({
              ...prev,
              photos: [...prev.photos, res.url],
            }));
            showToast("☁️ Photo uploaded to Cloudinary successfully!");
          }
        } catch (err) {
          console.error(err);
          showToast("❌ Failed to upload photo to Cloudinary.");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      showToast("❌ Unable to read image file.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      const payload = {
        fullName: editFormData.fullName,
        contactNumber: editFormData.contactNumber,
        age: Number(editFormData.age) || 24,
        gender: editFormData.gender,
        bio: editFormData.bio,
        jobTitle: editFormData.jobTitle,
        company: editFormData.company,
        educationLevel: editFormData.educationLevel,
        university: editFormData.university,
        height: editFormData.height,
        weight: editFormData.weight,
        interests: editFormData.interests,
        lookingFor: editFormData.lookingFor,
        lifestyle: editFormData.lifestyle,
        photos: editFormData.photos,
        location: {
          type: "Point",
          coordinates: [72.8777, 19.0760],
          city: editFormData.city,
        },
      };

      await updateMyProfileMutation(payload).unwrap();
      setIsEditingProfile(false);
      showToast("✅ Profile updated and saved to database successfully!");
    } catch (err) {
      console.error("Save profile error:", err);
      showToast("❌ Failed to update profile. Please try again.");
    }
  };

  // Active Chat State with Session Persistence & WhatsApp Feel
  const [activeChatMatch, setActiveChatMatch] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const chatBottomRef = useRef(null);
  const chatMessagesContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const chatInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleEmojiSelect = (emoji) => {
    setInputText((prev) => prev + emoji);
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 50);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast("❌ File size must be under 15MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const isImg = file.type.startsWith("image/");
      const sizeStr = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : Math.round(file.size / 1024) + " KB";

      setAttachedFile({
        name: file.name,
        size: sizeStr,
        type: file.type,
        isImage: isImg,
        dataUrl: reader.result,
      });
      showToast(`📎 Attached: ${file.name}`);
      setTimeout(() => chatInputRef.current?.focus(), 100);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
  };

  // Restore and maintain active chat selection across page refreshes
  useEffect(() => {
    const savedUserId = sessionStorage.getItem("sathi_active_chat_user_id");

    if (savedUserId) {
      const foundConv = allConversations.find(
        (c) => String(c.otherUserId || c.otherUser?._id || c.otherUser?.userId) === String(savedUserId)
      );
      if (foundConv) {
        setActiveChatMatch(foundConv.otherUser || foundConv);
        return;
      }
      const foundMatch = realMatches.find(
        (m) => String(m.otherUserId || m.userId || m._id) === String(savedUserId)
      );
      if (foundMatch) {
        setActiveChatMatch(foundMatch);
        return;
      }
    }

    // Default to first chat on desktop if not yet set
    if (!activeChatMatch && window.innerWidth >= 768) {
      if (allConversations.length > 0) {
        const firstUser = allConversations[0].otherUser || allConversations[0];
        setActiveChatMatch(firstUser);
        const targetId = firstUser.userId || firstUser._id || firstUser.otherUserId;
        if (targetId) sessionStorage.setItem("sathi_active_chat_user_id", String(targetId));
      } else if (realMatches.length > 0) {
        setActiveChatMatch(realMatches[0]);
        const targetId = realMatches[0].userId || realMatches[0]._id || realMatches[0].otherUserId;
        if (targetId) sessionStorage.setItem("sathi_active_chat_user_id", String(targetId));
      }
    }
  }, [realMatches, allConversations, activeChatMatch]);

  // Select Chat handler
  const handleSelectChat = (targetItem) => {
    const targetId = String(targetItem?.otherUserId || targetItem?.userId || targetItem?._id || "");
    if (targetId) {
      sessionStorage.setItem("sathi_active_chat_user_id", targetId);
    }
    setActiveChatMatch(targetItem);
    setMobileChatOpen(true);
  };

  // Find active conversation from MongoDB
  const activeConversation = useMemo(() => {
    if (!activeChatMatch) return null;
    const targetOtherId = String(activeChatMatch.otherUserId || activeChatMatch.userId || activeChatMatch._id || "");
    const matchConvId = String(activeChatMatch.conversationId || activeChatMatch._id || "");

    return (
      allConversations.find((c) => {
        if (matchConvId && (String(c._id) === matchConvId || String(c.id) === matchConvId)) return true;
        if (String(c.otherUserId) === targetOtherId) return true;
        return c.participants?.some((p) => String(p._id || p) === targetOtherId);
      }) || null
    );
  }, [activeChatMatch, allConversations]);

  // Real-time chat messages directly from MongoDB (Clean, no fake auto-read messages)
  const chatMessages = useMemo(() => {
    if (activeConversation?.messages && activeConversation.messages.length > 0) {
      return activeConversation.messages.map((m) => {
        const senderIdStr = String(m.senderId?._id || m.senderId || "");
        const currentUserIdStr = String(user?._id || user?.id || "");
        const isMe = senderIdStr === currentUserIdStr;
        return {
          id: m._id || m.id || Math.random(),
          senderId: senderIdStr,
          sender: isMe ? "me" : "them",
          text: m.text,
          isRead: Boolean(m.isRead),
          time: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Just now",
        };
      });
    }
    return [];
  }, [activeConversation, user]);

  // Mark conversation as read ONLY when user is actively inside that specific chat room
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isChatRoomVisible = activeTab === "messages" && (!isMobile || mobileChatOpen);

    if (isChatRoomVisible && activeConversation?._id) {
      const currentUserIdStr = String(user?._id || user?.id || "");
      const hasUnreadFromOther = activeConversation.messages?.some(
        (m) => String(m.senderId?._id || m.senderId) !== currentUserIdStr && !m.isRead
      );
      if (hasUnreadFromOther) {
        markConversationReadMutation(activeConversation._id);
      }
    }
  }, [activeTab, activeConversation, user, mobileChatOpen, markConversationReadMutation]);

  const scrollToBottom = () => {
    if (chatMessagesContainerRef.current) {
      chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (activeTab === "messages") {
      scrollToBottom();
    }
  }, [chatMessages, mobileChatOpen, activeTab]);

  useEffect(() => {
    if (!window.visualViewport) return;
    const handleViewportResize = () => {
      if (activeTab === "messages") {
        scrollToBottom();
      }
    };
    window.visualViewport.addEventListener("resize", handleViewportResize);
    return () => window.visualViewport?.removeEventListener("resize", handleViewportResize);
  }, [activeTab]);

  // Tab change helper
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Custom Hot Toast Helper (Top Right with Green Accent Bar)
  const showToast = (msg, type = "default", title) => {
    if (!msg) return;
    showCustomToast(msg, type, title);
  };

  // Dynamic Greeting based on Local Time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const userName = user?.fullName?.split(" ")[0] || "Friend";

  // 2. Real Card Action Handlers (Like / SuperLike / Pass)
  const handleLike = async (person) => {
    const targetId = person.userId || person._id || person.id;
    const pName = person.name || person.fullName || "Companion";

    // Optimistically remove from deck
    setDiscoverList((prev) => prev.filter((p) => (p.userId || p._id || p.id) !== targetId));

    try {
      const res = await swipeProfileMutation({ targetUserId: targetId, action: "like" }).unwrap();
      if (res.matched) {
        setMatchedCelebrationModal({
          name: pName,
          photo: person.photo || person.photos?.[0],
          person,
        });
        showToast(`🎉 Mutual Match with ${pName}!`, "success");
        refetchMatchesLikes();
        refetchConversations();
      } else {
        showToast(`💖 You liked ${pName}! If they like back, it's a match.`, "success");
      }
    } catch (err) {
      showToast(`💖 You liked ${pName}!`, "success");
    }
  };

  const handleSuperLike = async (person) => {
    const targetId = person.userId || person._id || person.id;
    const pName = person.name || person.fullName || "Companion";

    setDiscoverList((prev) => prev.filter((p) => (p.userId || p._id || p.id) !== targetId));

    try {
      const res = await swipeProfileMutation({ targetUserId: targetId, action: "superlike" }).unwrap();
      if (res.matched) {
        setMatchedCelebrationModal({
          name: pName,
          photo: person.photo || person.photos?.[0],
          person,
        });
        showToast(`⭐ Mutual Match with ${pName}!`, "success");
        refetchMatchesLikes();
        refetchConversations();
      } else {
        showToast(`⭐ Super Liked ${pName}! Priority notification sent.`, "success");
      }
    } catch (err) {
      showToast(`⭐ Super Liked ${pName}!`, "success");
    }
  };

  const handlePass = (person) => {
    const targetId = person.userId || person._id || person.id;
    const pName = person.name || person.fullName || "Companion";

    setDiscoverList((prev) => prev.filter((p) => (p.userId || p._id || p.id) !== targetId));

    try {
      swipeProfileMutation({ targetUserId: targetId, action: "pass" });
      showToast(`Passed on ${pName}.`);
    } catch (err) {
      showToast(`Passed on ${pName}.`);
    }
  };

  // 3. Match Action from Likes Tab (Like Back)
  const handleLikeBack = async (likedMeItem) => {
    const targetId = likedMeItem.userId || likedMeItem._id;
    const pName = likedMeItem.name || likedMeItem.fullName || "Companion";
    try {
      const res = await likeBackMutation({ targetUserId: targetId }).unwrap();
      if (res.matched) {
        setMatchedCelebrationModal({
          name: pName,
          photo: likedMeItem.photo || likedMeItem.photos?.[0],
          person: likedMeItem,
        });
        showToast(`🎉 You matched with ${pName}!`, "success");
        refetchMatchesLikes();
        refetchConversations();
      }
    } catch (err) {
      showToast(`🎉 Matched with ${pName}!`, "success");
    }
  };

  // 4. Send Real Chat Message Handler (Persisted to MongoDB with Attachment Support)
  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const textToSend = inputText.trim();
    if ((!textToSend && !attachedFile) || !activeChatMatch) return;

    let finalMessageText = textToSend;
    if (attachedFile) {
      if (attachedFile.isImage) {
        finalMessageText = `[IMG_ATTACHMENT:${attachedFile.name}|${attachedFile.dataUrl}]${textToSend ? `\n\n${textToSend}` : ""}`;
      } else {
        finalMessageText = `[DOC_ATTACHMENT:${attachedFile.name}|${attachedFile.size}|${attachedFile.dataUrl}]${textToSend ? `\n\n${textToSend}` : ""}`;
      }
    }

    setInputText("");
    setAttachedFile(null);
    setShowEmojiPicker(false);

    try {
      let convId = activeConversation?._id || activeChatMatch.conversationId;

      if (!convId) {
        const targetOtherId =
          activeChatMatch.otherUserId ||
          activeChatMatch.userId ||
          activeChatMatch._id;
        const res = await getOrCreateConversationWithUserMutation(targetOtherId).unwrap();
        convId = res?._id;
      }

      if (convId) {
        await sendMessageMutation({
          conversationId: convId,
          text: finalMessageText,
        }).unwrap();
        refetchConversations();
        setTimeout(scrollToBottom, 80);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      showToast("❌ Message failed to send. Please try again.", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    showCustomToast("You have been logged out successfully! 👋", "success", "Logged Out");
    navigate("/", { replace: true });
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Compass },
    { id: "discover", label: "Discover", icon: Search },
    { id: "likes", label: "Likes", icon: Heart, badge: likesCount > 0 ? likesCount : null },
    { id: "matches", label: "Matches", icon: Flame, badge: matchesCount > 0 ? matchesCount : null },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: totalUnreadCount > 0 ? totalUnreadCount : null },
    { id: "services", label: "Services & Wallet", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell, badge: likesCount > 0 ? likesCount : null },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fd] text-slate-800 font-sans overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. DESKTOP LEFT SIDEBAR                                                  */}
      {/* ========================================================================= */}
      <aside className="w-68 xl:w-76 shrink-0 flex flex-col justify-between border-r border-slate-200/90 bg-white p-5 select-none hidden md:flex z-20 shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        <div>
          {/* Logo */}
          <div
            onClick={() => handleTabChange("dashboard")}
            className="cursor-pointer flex items-center gap-3 px-2 py-1.5 transition hover:opacity-90 group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 shadow-md shadow-pink-500/25 text-white transition group-hover:scale-105">
              <Heart size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Sathi<span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">Meet</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`cursor-pointer w-full relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${isActive
                      ? "bg-gradient-to-r from-pink-50 via-rose-50/70 to-pink-50 text-pink-600 shadow-xs before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1.5 before:rounded-r-full before:bg-pink-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      size={20}
                      className={isActive ? "text-pink-600" : "text-slate-400"}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span
                      className={`flex h-5.5 min-w-5.5 items-center justify-center rounded-full px-2 text-xs font-black ${isActive
                          ? "bg-pink-600 text-white shadow-xs"
                          : "bg-pink-100 text-pink-700"
                        }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Go Premium Banner & Sign Out */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer -mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 py-3 text-xs font-extrabold text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs active:scale-95"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Logout / Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE DRAWER OVERLAY & SLIDE-OUT MENU                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[250] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-72 bg-white p-5 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-600 text-white shadow-sm">
                      <Heart size={18} fill="currentColor" />
                    </div>
                    <span className="text-xl font-black text-slate-900">SathiMeet</span>
                  </div>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="cursor-pointer p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="mt-5 space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTabChange(item.id)}
                        className={`cursor-pointer w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition ${isActive
                            ? "bg-pink-50 text-pink-600"
                            : "text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? "text-pink-600" : "text-slate-400"} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span className="bg-pink-600 text-white rounded-full px-2 py-0.5 text-xs font-black">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">


                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 py-3 text-xs font-extrabold text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs active:scale-95"
                >
                  <LogOut size={16} className="shrink-0" />
                  <span>Logout / Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT CONTAINER                                                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 sm:h-17 shrink-0 bg-white border-b border-slate-200/80 px-3 sm:px-8 flex items-center justify-between gap-2 sm:gap-4 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="cursor-pointer p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden transition shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 md:hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-600 text-white shadow-xs shrink-0">
                  <Heart size={14} fill="currentColor" />
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tight truncate">
                  Hi, {userName}
                </span>
              </div>

              <div className="hidden md:block min-w-0">
                <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>{greeting}, {userName}</span>
                  <span className="shrink-0">👋</span>
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Ready to make meaningful connections?
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Upgrade Button */}
            <button
              onClick={() => setShowPremiumModal(true)}
              className="cursor-pointer flex items-center justify-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 h-9 px-2.5 md:px-4 text-xs font-extrabold text-pink-700 shadow-xs hover:bg-pink-100 transition shrink-0"
              title="Upgrade to Premium"
            >
              <Crown size={15} className="text-amber-500 shrink-0" />
              <span className="hidden md:inline">Upgrade to Premium</span>
            </button>

            {/* Notification Icon */}
            <button
              onClick={() => handleTabChange("notifications")}
              className="cursor-pointer relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition shrink-0"
              title="Notifications"
            >
              <Bell size={16} />
              {likesCount > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white" />
              )}
            </button>

            {/* Messages Icon */}
            <button
              onClick={() => {
                setMobileChatOpen(false);
                handleTabChange("messages");
              }}
              className="cursor-pointer relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition shrink-0"
              title="Messages"
            >
              <MessageSquare size={16} />
              {totalUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-pink-600 text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                  {totalUnreadCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <div
              onClick={() => handleTabChange("profile")}
              className="cursor-pointer flex items-center gap-2 pl-1.5 sm:pl-2.5 border-l border-slate-200 shrink-0"
              title="My Profile"
            >
              <div className="relative h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-full ring-2 ring-pink-500/80 shadow-xs">
                <img
                  src={
                    profile?.photos?.[0] ||
                    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=300&auto=format&fit=crop"
                  }
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-bold text-slate-800 hidden lg:inline">
                {userName}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main
          className={`flex-1 overflow-y-auto ${activeTab === "messages"
              ? "p-0 md:p-6 lg:p-8 pb-0 md:pb-8 flex flex-col"
              : "p-4 sm:p-6 lg:p-8 pb-24 md:pb-8"
            }`}
        >
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW (Real Discover Cards & Real Matches Widgets)     */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
              {/* 1. Quick Stats Metric Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleTabChange("likes")}
                  title="View Who Liked You"
                  className="cursor-pointer rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-pink-300 hover:shadow-md transition text-left active:scale-98"
                >
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total Likes</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{likesCount}</p>
                    <p className="text-[11px] text-pink-600 font-semibold mt-0.5 flex items-center gap-1">
                      <span>People who liked you →</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <Heart size={20} className="fill-pink-500/20 stroke-[2.2]" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("matches")}
                  title="View Mutual Matches"
                  className="cursor-pointer rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-amber-300 hover:shadow-md transition text-left active:scale-98"
                >
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Mutual Matches</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{matchesCount}</p>
                    <p className="text-[11px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
                      <span>Ready to chat →</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <Flame size={20} className="fill-amber-500/20 stroke-[2.2]" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("messages")}
                  title="Open Messages"
                  className="cursor-pointer rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-violet-300 hover:shadow-md transition text-left active:scale-98"
                >
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Unread Chats</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalUnreadCount}</p>
                    <p className="text-[11px] text-violet-600 font-semibold mt-0.5 flex items-center gap-1">
                      <span>Direct messages →</span>
                    </p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <MessageSquare size={20} className="stroke-[2.2]" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange("profile")}
                  title="View Profile & Verification"
                  className="cursor-pointer rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between group hover:border-emerald-300 hover:shadow-md transition text-left active:scale-98"
                >
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Status</p>
                    <p className="text-base sm:text-lg font-black text-emerald-600 mt-1.5 flex items-center gap-1">
                      <span>Verified ID</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">100% Protected →</p>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                    <ShieldCheck size={22} className="stroke-[2.2]" />
                  </div>
                </button>
              </div>

              {/* 2. Discover People Header & 4 Large Responsive Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Featured Companions
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Verified members nearby looking for genuine companionship
                    </p>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleTabChange("discover")}
                      className="cursor-pointer text-xs sm:text-sm font-extrabold text-pink-600 hover:text-pink-700 transition"
                    >
                      View All →
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const first = discoverList[0];
                          if (first) setDiscoverList([...discoverList.slice(1), first]);
                        }}
                        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs transition active:scale-95"
                        aria-label="Previous Profile"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => {
                          const last = discoverList[discoverList.length - 1];
                          if (last) setDiscoverList([last, ...discoverList.slice(0, -1)]);
                        }}
                        className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs transition active:scale-95"
                        aria-label="Next Profile"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Cards Grid - Large, Clean & High Definition */}
                {discoverList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                    {discoverList.slice(0, 4).map((person) => {
                      const pName = person.name || person.fullName || "Companion";
                      const pPhoto =
                        person.photo ||
                        person.photos?.[0] ||
                        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop";

                      return (
                        <div
                          key={person._id || person.userId || person.id}
                          className="group relative flex flex-col justify-end overflow-hidden rounded-[26px] bg-slate-900 h-[440px] sm:h-[470px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-slate-100"
                        >
                          <img
                            src={pPhoto}
                            alt={pName}
                            onClick={() => {
                              setPreviewPhotoIndex(0);
                              setPreviewProfileModal(person);
                            }}
                            className="cursor-pointer absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />

                          {/* Top Right Heart Badge */}
                          <button
                            onClick={() => handleLike(person)}
                            className="cursor-pointer absolute top-3.5 right-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-pink-600 shadow-md transition hover:scale-110 active:scale-95"
                            title="Quick Like"
                          >
                            <Heart size={16} fill="currentColor" />
                          </button>

                          {/* Gradient Overlay & Profile Details */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent p-4 sm:p-5 text-white">
                            <div
                              onClick={() => {
                                setPreviewPhotoIndex(0);
                                setPreviewProfileModal(person);
                              }}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-lg sm:text-xl font-black truncate">{pName}, {person.age || 24}</span>
                                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white shrink-0">
                                  ✓
                                </span>
                              </div>

                              <p className="mt-1 text-xs text-slate-200 flex items-center gap-1 font-medium truncate">
                                <MapPin size={12} className="text-pink-400 shrink-0" />
                                <span>{person.city || "Mumbai, India"}</span>
                              </p>

                              {/* Passions Badges */}
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {(person.tags || person.interests || ["Travel", "Coffee"]).slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-white/15"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* 3 Circular Actions: [ ✖ Reject ] [ ⭐ Super Like ] [ 💖 Like ] */}
                            <div className="mt-3.5 flex items-center justify-center gap-3.5 pt-3 border-t border-white/15">
                              <button
                                onClick={() => handlePass(person)}
                                title="Pass"
                                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-95"
                              >
                                <X size={18} className="stroke-[2.5]" />
                              </button>

                              <button
                                onClick={() => handleSuperLike(person)}
                                title="Super Like"
                                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-500 shadow-md transition hover:bg-amber-50 hover:scale-110 active:scale-95"
                              >
                                <Star size={18} fill="currentColor" />
                              </button>

                              <button
                                onClick={() => handleLike(person)}
                                title="Like"
                                className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/40 transition hover:brightness-110 hover:scale-110 active:scale-95"
                              >
                                <Heart size={19} fill="currentColor" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-white p-8 text-center border border-slate-200">
                    <p className="text-base font-bold text-slate-700">All caught up on today's discoveries!</p>
                    <button
                      onClick={() => refetchDiscovery()}
                      className="cursor-pointer mt-3 rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-pink-700"
                    >
                      Reload Discoveries
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Bottom Row: Who Liked You & Your Matches */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 pt-2">
                {/* Widget 1: Who Liked You */}
                <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Who Liked You
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">People who showed real interest in your profile</p>
                    </div>

                    <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                      {likesCount} New Likes
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-3 overflow-hidden p-1">
                      {realLikes.length > 0 ? (
                        realLikes.slice(0, 5).map((liked) => (
                          <div
                            key={liked._id || liked.senderUserId}
                            onClick={() => handleTabChange("likes")}
                            className="inline-block h-12 w-12 rounded-full ring-3 ring-white overflow-hidden shadow-sm cursor-pointer hover:scale-110 transition"
                          >
                            <img
                              src={liked.photo || liked.photos?.[0]}
                              alt={liked.name || liked.fullName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-400 font-medium py-1">
                          No new likes yet. Keep swiping to get noticed!
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleTabChange("likes")}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded-2xl bg-pink-50 px-4 py-2.5 text-xs font-bold text-pink-600 hover:bg-pink-100 transition"
                    >
                      <span>View All Likes</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Widget 2: Your Matches */}
                <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Your Mutual Matches
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Companions ready to chat &amp; connect</p>
                    </div>

                    <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {matchesCount} Matches
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {realMatches.length > 0 ? (
                      realMatches.slice(0, 3).map((match) => (
                        <div
                          key={match._id || match.otherUserId}
                          onClick={() => {
                            setPreviewPhotoIndex(0);
                            setPreviewProfileModal(match);
                          }}
                          className="cursor-pointer flex items-center justify-between p-2.5 rounded-2xl hover:bg-pink-50/50 border border-slate-100/90 hover:border-pink-200 transition gap-2 group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-pink-500/20 shrink-0">
                              <img
                                src={match.photo || match.photos?.[0]}
                                alt={match.name || match.fullName}
                                className="h-full w-full object-cover group-hover:scale-105 transition"
                              />
                              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-extrabold text-slate-900 truncate group-hover:text-pink-600 transition">
                                {match.name || match.fullName}, {match.age || 24}
                              </p>
                              <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                                {match.job || match.jobTitle || match.city || "Tap to view profile & chat"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectChat(match);
                                handleTabChange("messages");
                              }}
                              className="cursor-pointer flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition shadow-2xs"
                              title="Chat directly"
                            >
                              <MessageSquare size={15} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-400 font-medium">
                        No matches yet. Like profiles to discover your companion matches!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleTabChange("matches")}
                    className="cursor-pointer w-full text-center text-xs font-extrabold text-pink-600 hover:underline pt-2 border-t border-slate-100"
                  >
                    See all matches →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DISCOVER (Tinder Swipe Deck)                                      */}
          {/* ========================================================================= */}
          {activeTab === "discover" && (
            <div className="max-w-md mx-auto h-[78vh] flex flex-col justify-between py-1 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1 mb-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Explore Discoveries</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Swipe right to Match, left to Pass</p>
                </div>
                <button
                  onClick={() => {
                    refetchDiscovery();
                    showToast("🔄 Discovery Deck Reloaded!");
                  }}
                  className="cursor-pointer text-xs font-bold text-pink-600 bg-pink-50 px-3.5 py-1.5 rounded-xl hover:bg-pink-100 transition active:scale-95"
                >
                  Reload Deck
                </button>
              </div>

              {/* Swipe Deck Container */}
              <div className="relative flex-1 w-full max-h-[530px]">
                {discoverList.length > 0 ? (
                  discoverList.map((person, index) => (
                    <FullSwipeCard
                      key={person._id || person.userId || person.id}
                      profile={person}
                      isTop={index === 0}
                      onSwipe={(dir) => {
                        if (dir === "right") handleLike(person);
                        else if (dir === "up") handleSuperLike(person);
                        else handlePass(person);
                      }}
                    />
                  ))
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <span className="text-4xl animate-bounce">✨</span>
                    <h3 className="mt-3 text-base font-extrabold text-slate-800">You've reached the end!</h3>
                    <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
                      Check back shortly or expand your distance filters to discover more companions nearby.
                    </p>
                    <button
                      onClick={() => refetchDiscovery()}
                      className="cursor-pointer mt-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 active:scale-95 transition"
                    >
                      Reload Discoveries 🚀
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Quick Controls */}
              {discoverList.length > 0 && (
                <div className="flex items-center justify-center gap-4 mt-3">
                  <button
                    onClick={() => handlePass(discoverList[0])}
                    title="Pass"
                    className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200/80 transition hover:bg-rose-50 hover:text-rose-600 hover:scale-110 active:scale-95"
                  >
                    <X size={22} className="stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => handleSuperLike(discoverList[0])}
                    title="Super Like"
                    className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-500 shadow-md ring-1 ring-slate-200/80 transition hover:bg-amber-50 hover:scale-110 active:scale-95"
                  >
                    <Star size={19} fill="currentColor" />
                  </button>

                  <button
                    onClick={() => handleLike(discoverList[0])}
                    title="Like"
                    className="cursor-pointer flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/35 transition hover:brightness-110 hover:scale-110 active:scale-95"
                  >
                    <Heart size={22} fill="currentColor" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: LIKES (Real "Who Liked You" & Like-Back Action)                     */}
          {/* ========================================================================= */}
          {activeTab === "likes" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 sm:p-6 rounded-3xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Who Liked You</span>
                    <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                      {likesCount} New
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Companions who showed real interest in your profile</p>
                </div>

                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 transition active:scale-95"
                >
                  <Crown size={15} className="text-amber-300" />
                  <span>See All Without Blurring</span>
                </button>
              </div>

              {realLikes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {realLikes.map((userItem) => {
                    const uName = userItem.name || userItem.fullName || "Companion";
                    const uPhoto =
                      userItem.photo ||
                      userItem.photos?.[0] ||
                      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop";

                    return (
                      <div
                        key={userItem._id || userItem.senderUserId}
                        className="relative aspect-[3/4.4] overflow-hidden rounded-[24px] bg-slate-900 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-slate-100 group transition hover:-translate-y-1"
                      >
                        <img
                          src={uPhoto}
                          alt={uName}
                          onClick={() => {
                            setPreviewPhotoIndex(0);
                            setPreviewProfileModal(userItem);
                          }}
                          className="cursor-pointer h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3.5 sm:p-4 flex flex-col justify-end text-white pointer-events-none">
                          <div
                            onClick={() => {
                              setPreviewPhotoIndex(0);
                              setPreviewProfileModal(userItem);
                            }}
                            className="pointer-events-auto cursor-pointer"
                          >
                            <span className="text-sm sm:text-base font-extrabold truncate block">
                              {uName}, {userItem.age || 24}
                            </span>
                            <p className="text-[11px] text-pink-300 font-medium truncate mt-0.5">
                              {userItem.reason || "Liked your profile"}
                            </p>
                          </div>

                          <div className="pointer-events-auto mt-2.5 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewPhotoIndex(0);
                                setPreviewProfileModal(userItem);
                              }}
                              className="cursor-pointer flex-1 rounded-xl bg-white/20 backdrop-blur-md py-2 text-[11px] font-bold text-white hover:bg-white/30 transition text-center"
                            >
                              Profile
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLikeBack(userItem)}
                              className="cursor-pointer flex-[1.4] rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-2 text-[11px] font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition"
                            >
                              Match 💖
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-12 text-center border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <Heart size={36} className="mx-auto text-pink-400 mb-3 animate-bounce" />
                  <h3 className="text-lg font-extrabold text-slate-900">No new incoming likes yet!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    Complete your profile and swipe in the Discover section to increase your chances of receiving likes.
                  </p>
                  <button
                    onClick={() => handleTabChange("discover")}
                    className="cursor-pointer mt-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 transition"
                  >
                    Explore Discover Feed
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MATCHES (Real Mutual Matches)                                      */}
          {/* ========================================================================= */}
          {activeTab === "matches" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Your Mutual Matches</span>
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                      {matchesCount} Active
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Companions ready to chat or plan companion meetups</p>
                </div>
              </div>

              {realMatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {realMatches.map((match) => {
                    const mName = match.name || match.fullName || "Companion";
                    const mPhoto =
                      match.photo ||
                      match.photos?.[0] ||
                      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=400&auto=format&fit=crop";

                    return (
                      <div
                        key={match._id || match.otherUserId}
                        className="group relative overflow-hidden rounded-[26px] bg-white p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-pink-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                      >
                        <div
                          onClick={() => {
                            setPreviewPhotoIndex(0);
                            setPreviewProfileModal(match);
                          }}
                          className="cursor-pointer flex items-center gap-4"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={mPhoto}
                              alt={mName}
                              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-pink-500/20 group-hover:scale-105 transition"
                            />
                            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-base font-extrabold text-slate-900 truncate group-hover:text-pink-600 transition">
                                {mName}, {match.age || 24}
                              </h4>
                              <span className="text-[10px] text-sky-500 font-bold shrink-0">✓</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                              {match.job || match.jobTitle || match.city || "Verified Companion"}
                            </p>
                          </div>
                        </div>

                        {/* Dual Actions: View Profile & Chat Now */}
                        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewPhotoIndex(0);
                              setPreviewProfileModal(match);
                            }}
                            className="cursor-pointer flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
                          >
                            <User size={14} />
                            <span>Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleSelectChat(match);
                              handleTabChange("messages");
                            }}
                            className="cursor-pointer flex-1 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-2.5 text-xs font-bold text-white shadow-xs hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
                          >
                            <MessageSquare size={14} />
                            <span>Chat Now</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-3xl bg-white p-12 text-center border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <Flame size={36} className="mx-auto text-amber-500 mb-3" />
                  <h3 className="text-lg font-extrabold text-slate-900">No mutual matches yet!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                    When you like someone and they like you back, they will appear here ready to chat!
                  </p>
                  <button
                    onClick={() => handleTabChange("discover")}
                    className="cursor-pointer mt-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 transition"
                  >
                    Start Swiping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: MESSAGES (Real Match Chat Integration)                             */}
          {/* ========================================================================= */}
          {activeTab === "messages" && (
            <div className="w-full max-w-6xl mx-auto h-[calc(100dvh-64px)] md:h-[calc(100vh-170px)] md:min-h-[580px] flex md:rounded-3xl bg-white md:border md:border-slate-200/90 md:shadow-md overflow-hidden flex-1">
              {/* Left Conversation List */}
              <div
                className={`w-full md:w-84 shrink-0 border-r border-slate-100 flex-col bg-white ${mobileChatOpen ? "hidden md:flex" : "flex"
                  }`}
              >
                <div className="p-4 sm:p-5 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Messages</h3>
                      <span className="flex h-5.5 px-2 items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-xs font-black text-white shadow-xs">
                        {realMatches.length}
                      </span>
                    </div>

                    <button
                      onClick={() => showToast("Showing active match chats")}
                      className="cursor-pointer text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition"
                    >
                      <Sliders size={16} />
                    </button>
                  </div>

                  <div className="relative mt-3.5">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search matches & chats..."
                      className="w-full rounded-2xl bg-slate-50 py-2 pl-10 pr-4 text-xs sm:text-sm font-medium outline-none border border-slate-200/80 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {(allConversations.length > 0 || realMatches.length > 0) ? (
                    (() => {
                      const displayedIds = new Set();
                      const chatItems = [];

                      // 1. Real conversations from MongoDB
                      for (const conv of allConversations) {
                        const targetId = String(conv.otherUserId || conv.otherUser?._id || conv.otherUser?.userId || "");
                        if (!targetId || displayedIds.has(targetId)) continue;
                        displayedIds.add(targetId);

                        chatItems.push({
                          conversationId: conv._id,
                          otherUserId: targetId,
                          _id: conv._id,
                          name: conv.otherUser?.fullName || conv.otherUser?.name || "Companion",
                          photo: conv.otherUser?.photo || conv.otherUser?.photos?.[0],
                          lastMessage: conv.lastMessage || "Say hello to your match! 👋",
                          time: conv.updatedAt
                            ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Recent",
                          unreadCount: conv.unreadCount || 0,
                          rawObj: conv.otherUser || conv,
                        });
                      }

                      // 2. Matches without prior messages
                      for (const match of realMatches) {
                        const targetId = String(match.otherUserId || match.userId || match._id || "");
                        if (!targetId || displayedIds.has(targetId)) continue;
                        displayedIds.add(targetId);

                        chatItems.push({
                          conversationId: match.conversationId,
                          otherUserId: targetId,
                          _id: match._id,
                          name: match.name || match.fullName || "Companion",
                          photo: match.photo || match.photos?.[0],
                          lastMessage: match.lastMessage || "Matched! Say hello! 👋",
                          time: match.time || "Just now",
                          unreadCount: 0,
                          rawObj: match,
                        });
                      }

                      return chatItems.map((item) => {
                        const isSelected =
                          String(activeChatMatch?._id || activeChatMatch?.otherUserId || activeChatMatch?.userId) ===
                          String(item.otherUserId || item._id);

                        return (
                          <div
                            key={item._id || item.otherUserId}
                            onClick={() => {
                              handleSelectChat(item.rawObj);
                            }}
                            className={`cursor-pointer group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-200 ${isSelected
                                ? "bg-emerald-50/80 border border-emerald-200/90 shadow-xs"
                                : "hover:bg-slate-50 border border-transparent"
                              }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="relative shrink-0">
                                <img
                                  src={
                                    item.photo ||
                                    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=400&auto=format&fit=crop"
                                  }
                                  alt={item.name}
                                  className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                                />
                                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                                  {item.lastMessage}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                              <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                              {item.unreadCount > 0 ? (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00a884] px-1.5 text-[10px] font-black text-white shadow-xs animate-pulse">
                                  {item.unreadCount}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No chats yet. Connect in Discover or Likes tab!
                    </div>
                  )}
                </div>
              </div>

              {/* Right Chat Room (WhatsApp Theme) */}
              <div
                className={`w-full flex-1 flex-col bg-[#efeae2] min-w-0 h-full relative ${mobileChatOpen ? "flex" : "hidden md:flex"
                  }`}
              >
                {activeChatMatch ? (
                  <>
                    {/* Chat Top Header (WhatsApp Style - No Tick Mark) */}
                    <div className="h-16 px-3 sm:px-5 bg-[#f0f2f5] border-b border-slate-200/80 flex items-center justify-between shadow-2xs shrink-0 z-10">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <button
                          onClick={() => setMobileChatOpen(false)}
                          className="md:hidden cursor-pointer p-1.5 -ml-1 rounded-full text-slate-700 hover:bg-slate-200 transition shrink-0"
                          aria-label="Back to chats list"
                        >
                          <ChevronLeft size={22} />
                        </button>

                        <div className="relative shrink-0">
                          <img
                            src={activeChatMatch.photo || activeChatMatch.photos?.[0]}
                            alt={activeChatMatch.name || activeChatMatch.fullName}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-emerald-500/20"
                          />
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                            {activeChatMatch.name || activeChatMatch.fullName}
                          </h4>
                          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>online</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleInitiateCall(activeChatMatch, "audio")}
                          className="cursor-pointer flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200 hover:text-emerald-700 transition active:scale-95"
                          title="Start HD Audio Call 📞"
                        >
                          <Phone size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInitiateCall(activeChatMatch, "video")}
                          className="cursor-pointer flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200 hover:text-emerald-700 transition active:scale-95"
                          title="Start HD Video Call 📹"
                        >
                          <Video size={19} />
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp Message Bubble Feed with Wallpaper */}
                    <div
                      ref={chatMessagesContainerRef}
                      className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2.5 relative flex flex-col min-h-0 bg-[#efeae2]"
                      style={{
                        backgroundImage: `radial-gradient(#d1d7db 0.8px, transparent 0.8px), radial-gradient(#d1d7db 0.8px, #efeae2 0.8px)`,
                        backgroundSize: "28px 28px",
                        backgroundPosition: "0 0, 14px 14px",
                      }}
                    >
                      <div className="text-center my-1 shrink-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm px-3.5 py-1 text-[11px] font-bold text-slate-600 shadow-2xs">
                          🔒 Messages are end-to-end encrypted
                        </span>
                      </div>

                      {chatMessages.length === 0 ? (
                        <div className="text-center py-10 px-4 space-y-3 max-w-sm mx-auto my-auto bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100">
                          <div className="h-14 w-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-2xl shadow-inner text-emerald-600">
                            💬
                          </div>
                          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                            You & {activeChatMatch.name || activeChatMatch.fullName} are connected!
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Send a warm message or pick a quick starter below:
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center pt-2">
                            {[
                              "Hey! Great to connect 💖",
                              "Love your vibe! ✨",
                              "What's your favorite coffee spot? ☕",
                            ].map((icebreaker) => (
                              <button
                                key={icebreaker}
                                type="button"
                                onClick={() => {
                                  setInputText(icebreaker);
                                  chatInputRef.current?.focus();
                                }}
                                className="cursor-pointer rounded-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 shadow-2xs transition"
                              >
                                {icebreaker}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg) => {
                          const isMe = msg.sender === "me";
                          const isCallLog =
                            typeof msg.text === "string" &&
                            (msg.text.startsWith("📹 Video Call") || msg.text.startsWith("📞 Audio Call"));

                          if (isCallLog) {
                            const isVideo = msg.text.startsWith("📹 Video Call");
                            const isMissed = msg.text.includes("(Missed)");
                            const isDeclined = msg.text.includes("(Declined)");
                            const isEnded = msg.text.includes("(Ended");
                            const isCancelled = msg.text.includes("(Cancelled)");

                            return (
                              <div
                                key={msg.id}
                                className={`flex ${isMe ? "justify-end" : "justify-start"} my-1.5`}
                              >
                                <div className="max-w-[92%] sm:max-w-[80%] rounded-2xl bg-white p-3 sm:p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.08)] border border-slate-200/80 transition-all">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 shadow-2xs ${
                                        isMissed || isDeclined
                                          ? "bg-rose-100 text-rose-600"
                                          : isEnded
                                          ? "bg-emerald-100 text-emerald-700"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {isVideo ? <Video size={18} /> : <Phone size={18} />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                                        {isVideo ? "Video Call" : "Audio Call"}
                                      </p>
                                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 whitespace-normal break-words">
                                        {isMissed
                                          ? "Missed call"
                                          : isDeclined
                                          ? "Declined call"
                                          : isCancelled
                                          ? "Cancelled call"
                                          : isEnded
                                          ? msg.text.replace(/^.*Call\s*/, "") || "Call ended"
                                          : "Call completed"}
                                      </p>
                                    </div>

                                    {/* WhatsApp Style Call Back Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleInitiateCall(activeChatMatch, isVideo ? "video" : "audio")}
                                      className="cursor-pointer flex items-center gap-1 bg-[#00a884] hover:bg-[#008f6f] text-white px-3 py-1.5 rounded-full font-bold text-[11px] shrink-0 transition active:scale-95 shadow-2xs"
                                    >
                                      <span>Call Back</span>
                                    </button>
                                  </div>

                                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                    <span>{isMe ? "Outgoing call" : "Incoming call"}</span>
                                    <span>{msg.time}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Check if message is a document or image attachment
                          const isDocAttachment = typeof msg.text === "string" && msg.text.includes("[DOC_ATTACHMENT:");
                          const isImgAttachment = typeof msg.text === "string" && msg.text.includes("[IMG_ATTACHMENT:");

                          if (isDocAttachment || isImgAttachment) {
                            let docName = "Document";
                            let docSize = "";
                            let docUrl = "";
                            let caption = "";

                            if (isDocAttachment) {
                              const match = msg.text.match(/\[DOC_ATTACHMENT:(.*?)\|(.*?)\|(.*?)\]/s);
                              if (match) {
                                docName = match[1];
                                docSize = match[2];
                                docUrl = match[3];
                                caption = msg.text.replace(/\[DOC_ATTACHMENT:.*?\]/s, "").trim();
                              }
                            } else if (isImgAttachment) {
                              const match = msg.text.match(/\[IMG_ATTACHMENT:(.*?)\|(.*?)\]/s);
                              if (match) {
                                docName = match[1];
                                docUrl = match[2];
                                caption = msg.text.replace(/\[IMG_ATTACHMENT:.*?\]/s, "").trim();
                              }
                            }

                            return (
                              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[88%] sm:max-w-[75%] rounded-2xl p-2.5 sm:p-3 text-xs sm:text-sm font-medium shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                                    isMe ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-xs" : "bg-white text-[#111b21] rounded-tl-xs"
                                  }`}
                                >
                                  {isImgAttachment && docUrl ? (
                                    <div className="space-y-1.5">
                                      <div className="rounded-xl overflow-hidden max-h-64 bg-slate-900/10">
                                        <img
                                          src={docUrl}
                                          alt={docName}
                                          className="w-full h-auto object-cover max-h-64 rounded-xl cursor-pointer hover:opacity-95 transition"
                                          onClick={() => window.open(docUrl, "_blank")}
                                        />
                                      </div>
                                      {caption && <p className="text-xs sm:text-sm leading-relaxed px-1">{caption}</p>}
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-3 p-2.5 bg-black/5 rounded-xl border border-black/5">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shrink-0 shadow-xs">
                                          <FileText size={20} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">{docName}</p>
                                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{docSize || "Document file"}</p>
                                        </div>
                                        {docUrl && (
                                          <a
                                            href={docUrl}
                                            download={docName}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-slate-100 text-slate-700 shadow-xs transition active:scale-95 shrink-0"
                                            title="Download / Open Document"
                                          >
                                            <Download size={14} />
                                          </a>
                                        )}
                                      </div>
                                      {caption && <p className="text-xs sm:text-sm leading-relaxed px-1">{caption}</p>}
                                    </div>
                                  )}
                                  <div className="mt-1 flex items-center justify-end gap-1 text-[10.5px] font-medium text-[#667781]">
                                    <span>{msg.time}</span>
                                    {isMe && (
                                      <span className="inline-flex items-center ml-0.5" title={msg.isRead ? "Seen" : "Sent"}>
                                        {msg.isRead ? (
                                          <CheckCheck size={14} className="text-[#53bdeb] stroke-[2.5]" />
                                        ) : (
                                          <CheckCheck size={14} className="text-[#8696a0] stroke-[2]" />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition-transform ${
                                  isMe
                                    ? "bg-[#d9fdd3] text-[#111b21] rounded-tr-xs"
                                    : "bg-white text-[#111b21] rounded-tl-xs"
                                }`}
                              >
                                <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                                <div className="mt-0.5 flex items-center justify-end gap-1 text-[10.5px] font-medium text-[#667781]">
                                  <span>{msg.time}</span>
                                  {isMe && (
                                    <span className="inline-flex items-center ml-0.5" title={msg.isRead ? "Seen" : "Sent"}>
                                      {msg.isRead ? (
                                        <CheckCheck size={14} className="text-[#53bdeb] stroke-[2.5]" />
                                      ) : (
                                        <CheckCheck size={14} className="text-[#8696a0] stroke-[2]" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatBottomRef} className="h-1" />
                    </div>

                    {/* WhatsApp Message Input Bar with Emoji Palette, Attachments & Mobile Keyboard Scroll */}
                    <div className="relative shrink-0 z-30">
                      {/* Selected Attachment Preview Badge */}
                      {attachedFile && (
                        <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-bottom-1">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00a884] text-white shrink-0 shadow-2xs">
                              {attachedFile.isImage ? <Camera size={16} /> : <FileText size={16} />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">{attachedFile.name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{attachedFile.size} • Ready to send</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveAttachment}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition cursor-pointer"
                            title="Remove attachment"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}

                      {/* Interactive WhatsApp Emoji Picker Tray */}
                      {showEmojiPicker && (
                        <div
                          ref={emojiPickerRef}
                          className="absolute bottom-16 left-3 sm:left-4 z-40 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 w-72 sm:w-84 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95"
                        >
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-700">Quick Emojis 😊</span>
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(false)}
                              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                              aria-label="Close emoji picker"
                            >
                              <X size={15} />
                            </button>
                          </div>
                          <div className="grid grid-cols-8 gap-1.5 text-xl">
                            {[
                              "❤️", "😍", "😂", "🔥", "💖", "😘", "✨", "😊",
                              "🥰", "🌹", "👍", "🎉", "🙈", "💯", "🙏", "🥳",
                              "🥺", "💬", "🤩", "☕", "🥂", "🌸", "💃", "🕺",
                              "🎁", "🚀", "💌", "🤤", "😋", "🤣", "😜", "🤝",
                              "🎂", "🍫", "🧸", "🏖️", "✈️", "🎬", "🎵", "🍕",
                              "🍿", "🍦", "🍹", "🍷", "🚗", "🎈", "👋", "💫"
                            ].map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleEmojiSelect(emoji)}
                                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 transition hover:scale-125"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <form
                        onSubmit={handleSendMessage}
                        className="p-2 sm:p-3 bg-[#f0f2f5] border-t border-slate-200/80 flex items-center gap-1.5 sm:gap-2.5 w-full shrink-0 shadow-xs sticky bottom-0"
                      >
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker((prev) => !prev)}
                          className="cursor-pointer text-slate-500 hover:text-[#00a884] p-2 rounded-full hover:bg-slate-200 transition shrink-0"
                          title="Insert Emojis"
                        >
                          <Smile size={22} />
                        </button>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.xls,.xlsx"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="cursor-pointer text-slate-500 hover:text-[#00a884] p-2 rounded-full hover:bg-slate-200 transition shrink-0"
                          title="Attach Document / Photo"
                        >
                          <Plus size={22} />
                        </button>

                        <input
                          ref={chatInputRef}
                          type="text"
                          value={inputText}
                          onFocus={() => {
                            setTimeout(scrollToBottom, 250);
                          }}
                          onBlur={() => {
                            setTimeout(scrollToBottom, 100);
                          }}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder={attachedFile ? `Add a caption for ${attachedFile.name}...` : `Message ${activeChatMatch.name || activeChatMatch.fullName}...`}
                          className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none border border-slate-200/60 focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884] transition shadow-2xs"
                        />

                        <button
                          type="submit"
                          disabled={!inputText.trim() && !attachedFile}
                          className="cursor-pointer flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white shadow-md shadow-emerald-500/25 hover:bg-[#008f6f] active:scale-95 transition disabled:opacity-40 disabled:pointer-events-none"
                          title="Send Message"
                        >
                          <Send size={16} />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
                    <MessageSquare size={40} className="mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700">Select a Match to start messaging</p>
                    <p className="text-xs text-slate-400 mt-1">Connect with companions through mutual likes</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: NOTIFICATIONS                                                     */}
          {/* ========================================================================= */}
          {activeTab === "notifications" && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Notifications &amp; Activity</h2>
                <p className="text-sm text-slate-500">Live alerts for likes, matches, and companion bookings</p>
              </div>

              <div className="space-y-3">
                {realLikes.length > 0 && (
                  <div className="rounded-2xl bg-pink-50/70 border border-pink-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white shadow-sm">
                        <Heart size={18} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">You have {realLikes.length} new profile likes!</p>
                        <p className="text-xs text-slate-500">Check who liked you and match back to start chatting.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTabChange("likes")}
                      className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-700 transition"
                    >
                      View Likes
                    </button>
                  </div>
                )}

                {realMatches.length > 0 && (
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
                        <Flame size={18} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">You have {realMatches.length} mutual companion matches!</p>
                        <p className="text-xs text-slate-500">Your matches are waiting to chat and plan meetups.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTabChange("matches")}
                      className="cursor-pointer rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition"
                    >
                      View Matches
                    </button>
                  </div>
                )}

                <div className="rounded-2xl bg-white border border-slate-200/80 p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Account Verified &amp; Protected</p>
                    <p className="text-xs text-slate-500">Your profile is 100% ID verified for safe companion experiences.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: SERVICES & WALLET (100% Real Purchased Services & Invoices)        */}
          {/* ========================================================================= */}
          {activeTab === "services" && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    My Services &amp; Companion Wallet
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Track all your booked companion sessions, payment transaction receipts, and active tokens
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      refetchMyServices();
                      refetchMyPayments();
                      showToast("🔄 Services & Wallet Refreshed!");
                    }}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                  >
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={() => navigate("/services")}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 transition active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Book New Service</span>
                  </button>
                </div>
              </div>

              {/* 4 Real Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-rose-50 p-5 border border-pink-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-pink-700">Active Services</p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600 text-sm shadow-2xs">
                      ✨
                    </span>
                  </div>
                  <p className="mt-2.5 text-2xl font-black text-slate-900">{purchasedServices.length} Services</p>
                  <p className="mt-0.5 text-xs text-slate-500 font-medium">Ready in your companion wallet</p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 border border-emerald-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-emerald-700">Total Spent</p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm shadow-2xs">
                      ₹
                    </span>
                  </div>
                  <p className="mt-2.5 text-2xl font-black text-slate-900">
                    ₹{totalSpent.toLocaleString("en-IN")}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 font-medium">Verified payments made</p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-violet-50 via-white to-purple-50 p-5 border border-violet-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-violet-700">Total Orders</p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600 text-sm shadow-2xs">
                      <CreditCard size={15} />
                    </span>
                  </div>
                  <p className="mt-2.5 text-2xl font-black text-slate-900">{myPayments.length} Invoices</p>
                  <p className="mt-0.5 text-xs text-slate-500 font-medium">Completed bookings</p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 border border-amber-100 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-700">Account Safety</p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 text-sm shadow-2xs">
                      <ShieldCheck size={16} />
                    </span>
                  </div>
                  <p className="mt-2.5 text-lg sm:text-xl font-black text-emerald-600">100% ID Verified</p>
                  <p className="mt-0.5 text-xs text-slate-500 font-medium">Secure &amp; Safe Meetups</p>
                </div>
              </div>

              {/* Section 1: Purchased Services Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      My Booked Services ({purchasedServices.length})
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Companion services you have unlocked and purchased
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/services")}
                    className="cursor-pointer text-xs font-bold text-pink-600 hover:underline"
                  >
                    View full catalog →
                  </button>
                </div>

                {purchasedServices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {purchasedServices.map((service, index) => {
                      const purchaseDate = service.lastPurchasedAt
                        ? new Date(service.lastPurchasedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recently";

                      return (
                        <div
                          key={service.serviceId || index}
                          className="group rounded-3xl bg-white p-5 border border-slate-200/90 shadow-xs hover:border-pink-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Top Pill Header */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Service
                              </span>
                              <span className="text-sm font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                                ₹{service.price ? service.price.toLocaleString("en-IN") : "0"}
                              </span>
                            </div>

                            {/* Service Title */}
                            <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-pink-600 transition">
                              {service.title || "Companion Meetup Session"}
                            </h4>

                            {/* Purchase Meta Info */}
                            <div className="mt-3.5 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-semibold">Purchased On:</span>
                                <span className="font-bold text-slate-800">{purchaseDate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-semibold">Bookings Count:</span>
                                <span className="font-bold text-slate-800">
                                  {service.purchaseCount || 1} Session(s)
                                </span>
                              </div>
                              {service.purchaseHistory?.[0]?.orderId && (
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400 font-semibold">Order Ref:</span>
                                  <span className="font-mono text-[11px] font-bold text-slate-700 truncate max-w-[140px]">
                                    {service.purchaseHistory[0].orderId}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => navigate("/services")}
                              className="cursor-pointer flex-1 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-2.5 text-xs font-bold text-white shadow-xs hover:brightness-110 active:scale-95 transition text-center"
                            >
                              Book Again 🚀
                            </button>
                            <button
                              type="button"
                              onClick={() => showToast(`Invoice available for ${service.title}`)}
                              className="cursor-pointer rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition"
                              title="View Invoice Receipt"
                            >
                              Receipt 📄
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-white p-10 sm:p-14 text-center border border-slate-200/90 shadow-xs space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 text-3xl shadow-inner">
                      <CreditCard size={32} />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="text-lg sm:text-xl font-black text-slate-900">
                        No Booked Services Yet
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        You haven't booked any verified companion sessions or meetup tokens yet. Explore our services catalog to book movies, dinners, travels, or dates!
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/services")}
                      className="cursor-pointer mt-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-pink-500/30 hover:brightness-110 transition active:scale-95"
                    >
                      <Sparkles size={16} />
                      <span>Browse Services Catalog 🚀</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Section 2: Transaction Receipts & Payment History Table */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Payment Invoices &amp; Transaction History ({myPayments.length})
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Real-time log of your completed payments and receipts
                    </p>
                  </div>
                </div>

                {myPayments.length > 0 ? (
                  <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                        <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                          <tr>
                            <th className="p-4 sm:px-6">Order ID</th>
                            <th className="p-4 sm:px-6">Services Included</th>
                            <th className="p-4 sm:px-6">Date &amp; Time</th>
                            <th className="p-4 sm:px-6">Amount</th>
                            <th className="p-4 sm:px-6">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {myPayments.map((payment) => {
                            const dateStr = payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Recently";

                            const serviceNames =
                              payment.services && payment.services.length > 0
                                ? payment.services.map((s) => s.title).join(", ")
                                : "Companion Service";

                            return (
                              <tr key={payment._id || payment.orderId} className="hover:bg-slate-50/70 transition">
                                <td className="p-4 sm:px-6 font-mono text-xs font-bold text-slate-900">
                                  {payment.orderId || payment._id}
                                </td>
                                <td className="p-4 sm:px-6 font-bold text-slate-900 max-w-[200px] truncate">
                                  {serviceNames}
                                </td>
                                <td className="p-4 sm:px-6 text-slate-500 text-xs">{dateStr}</td>
                                <td className="p-4 sm:px-6 font-black text-slate-900">
                                  ₹{payment.amount ? payment.amount.toLocaleString("en-IN") : "0"}
                                </td>
                                <td className="p-4 sm:px-6">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                      payment.status === "completed"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : payment.status === "failed"
                                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                                        : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        payment.status === "completed"
                                          ? "bg-emerald-500"
                                          : payment.status === "failed"
                                          ? "bg-rose-500"
                                          : "bg-amber-500"
                                      }`}
                                    />
                                    {payment.status === "completed" ? "Paid / Verified" : payment.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-white border border-slate-200/80 text-center text-xs sm:text-sm text-slate-500">
                    No payment transaction records found in your account yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: PROFILE (Complete View & Live Editable Profile Details)            */}
          {/* ========================================================================= */}
          {activeTab === "profile" && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Profile Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <span>My Profile Overview</span>
                    {isEditingProfile && (
                      <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 animate-pulse">
                        Editing Mode
                      </span>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {isEditingProfile
                      ? "Update your details below and click Save to update your profile in the database."
                      : "Preview what other members see on Sathi Meet & manage your details."}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {!isEditingProfile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(true)}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 transition active:scale-95"
                      >
                        <Edit3 size={15} />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/dashboard/onboarding")}
                        className="cursor-pointer hidden sm:inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Sparkles size={14} className="text-pink-600" />
                        <span>Onboarding Wizard</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                      >
                        <X size={15} />
                        <span>Cancel</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/25 hover:brightness-110 transition active:scale-95 disabled:opacity-50"
                      >
                        {isSavingProfile ? (
                          <>
                            <Loader2 size={15} className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={15} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Details Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Left Column: Identity & Contact Card */}
                <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="text-center">
                    <div className="relative mx-auto h-36 w-36 rounded-full overflow-hidden ring-4 ring-pink-500/20 shadow-md">
                      <img
                        src={
                          (isEditingProfile ? editFormData.photos?.[0] : profile?.photos?.[0]) ||
                          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop"
                        }
                        alt="Profile Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="mt-4">
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {isEditingProfile ? editFormData.fullName : user?.fullName || "My Name"}
                        {", "}
                        {isEditingProfile ? editFormData.age : profile?.age || 24}
                      </h3>
                      <p className="text-xs font-bold text-pink-600 flex items-center justify-center gap-1 mt-0.5">
                        <ShieldCheck size={14} />
                        <span>100% ID Verified Member</span>
                      </p>
                    </div>
                  </div>

                  {/* Left Column Fields (View vs Edit) */}
                  <div className="pt-4 border-t border-slate-100 space-y-3.5 text-xs">
                    {/* Full Name */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editFormData.fullName}
                          onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                          className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                        />
                      ) : (
                        <p className="font-bold text-slate-800 text-sm mt-0.5">{user?.fullName || "Not provided"}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                      <p className="font-semibold text-slate-700 mt-0.5 truncate">{user?.email || "Not provided"}</p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contact Number</label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={editFormData.contactNumber}
                          onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                          className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                        />
                      ) : (
                        <p className="font-bold text-slate-800 mt-0.5">{user?.contactNumber || "Not provided"}</p>
                      )}
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Age</label>
                        {isEditingProfile ? (
                          <input
                            type="number"
                            min="18"
                            max="99"
                            value={editFormData.age}
                            onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 mt-0.5">{profile?.age || 24} years</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gender</label>
                        {isEditingProfile ? (
                          <select
                            value={editFormData.gender}
                            onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                          </select>
                        ) : (
                          <p className="font-bold text-slate-800 mt-0.5">{profile?.gender || "Female"}</p>
                        )}
                      </div>
                    </div>

                    {/* City / Location */}
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">City / Location</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editFormData.city}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                          placeholder="e.g. Mumbai, India"
                        />
                      ) : (
                        <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                          <MapPin size={13} className="text-pink-500" />
                          <span>{profile?.location?.city || "Mumbai, India"}</span>
                        </p>
                      )}
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Height</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.height}
                            onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                            placeholder="e.g. 5'6&quot;"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 mt-0.5">{profile?.height || "5'6\""}</p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Weight</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.weight}
                            onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                            placeholder="e.g. 55 kg"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 mt-0.5">{profile?.weight || "55 kg"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Right Column: Detailed Bio, Passions, Career & Lifestyle */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Section 1: About & Bio */}
                  <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>About &amp; Bio</span>
                      <span className="text-[10px] text-pink-600 font-bold">Public Bio</span>
                    </h4>

                    {isEditingProfile ? (
                      <textarea
                        rows={4}
                        value={editFormData.bio}
                        onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                        className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition leading-relaxed"
                        placeholder="Write a warm, engaging bio introducing your vibe and what you look for in companion meetups..."
                      />
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {profile?.bio || "Living each day with curiosity, music, and looking for genuine companion connections on Sathi Meet."}
                      </p>
                    )}
                  </div>

                  {/* Section 2: Career & Education */}
                  <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Career &amp; Education
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500">Job Title / Profession</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.jobTitle}
                            onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                            placeholder="e.g. Visual Designer / Tech Consultant"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                            <Briefcase size={14} className="text-violet-500" />
                            <span>{profile?.jobTitle || "Verified Professional"}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500">Company / Organization</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.company}
                            onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                            placeholder="e.g. Creative Studio / Google"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 text-sm mt-0.5">
                            {profile?.company || "Independent"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500">Education Degree</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.educationLevel}
                            onChange={(e) => setEditFormData({ ...editFormData, educationLevel: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                            placeholder="e.g. Bachelors in Design / Masters"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                            <GraduationCap size={14} className="text-sky-500" />
                            <span>{profile?.educationLevel || "Graduate"}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-500">University / College</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={editFormData.university}
                            onChange={(e) => setEditFormData({ ...editFormData, university: e.target.value })}
                            className="w-full mt-1 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition"
                            placeholder="e.g. University of Delhi / Mumbai University"
                          />
                        ) : (
                          <p className="font-bold text-slate-800 text-sm mt-0.5">
                            {profile?.university || "Delhi University"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Passions & Interests */}
                  <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Passions &amp; Interests
                    </h4>

                    {/* Chips Display */}
                    <div className="flex flex-wrap gap-2">
                      {(isEditingProfile ? editFormData.interests : profile?.interests || ["Travel", "Coffee", "Music", "Photography", "Fitness"]).map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 border border-pink-100 px-3.5 py-1.5 text-xs font-bold text-pink-700 shadow-2xs"
                        >
                          <span>{item}</span>
                          {isEditingProfile && (
                            <button
                              type="button"
                              onClick={() => handleRemoveInterest(item)}
                              className="cursor-pointer hover:text-rose-600 text-pink-400 transition ml-0.5"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Add new Tag (in edit mode) */}
                    {isEditingProfile && (
                      <div className="pt-2 space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddInterest();
                              }
                            }}
                            placeholder="Type an interest & press Enter (e.g. Pottery, Indie Music)..."
                            className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-pink-500 focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddInterest()}
                            className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-pink-700"
                          >
                            Add
                          </button>
                        </div>

                        {/* Preset Suggestion Tags */}
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[11px] font-bold text-slate-400">Suggestions:</span>
                          {["Yoga", "Hiking", "Art", "Books", "Tech", "Foodie", "Concerts", "Cafe Hopping", "Gaming"].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleAddInterest(tag)}
                              className="cursor-pointer text-[11px] font-semibold bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-600 rounded-lg px-2 py-0.5 transition"
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 4: Looking For */}
                  <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Looking For
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "Meaningful Connection",
                        "Companion Meetups",
                        "Casual Coffee",
                        "Travel Buddy",
                        "Long-term Dating"
                      ].map((item) => {
                        const isSelected = isEditingProfile
                          ? editFormData.lookingFor.includes(item)
                          : (profile?.lookingFor || ["Meaningful Connection", "Companion Meetups"]).includes(item);

                        return (
                          <button
                            key={item}
                            type="button"
                            disabled={!isEditingProfile}
                            onClick={() => isEditingProfile && handleToggleLookingFor(item)}
                            className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${isSelected
                                ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-sm"
                                : isEditingProfile
                                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                                  : "bg-slate-100 text-slate-400 opacity-60"
                              }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 5: Lifestyle Habits */}
                  <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Lifestyle Habits
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Drinking", key: "drinking", options: ["Never", "Socially", "Regularly"] },
                        { label: "Smoking", key: "smoking", options: ["Never", "Occasionally", "Regularly"] },
                        { label: "Workout", key: "workout", options: ["Daily", "Regularly", "Sometimes", "Never"] },
                        { label: "Diet", key: "diet", options: ["Vegetarian", "Non-Vegetarian", "Vegan", "Flexible"] },
                        { label: "Pets", key: "pets", options: ["Dog lover", "Cat lover", "No pets", "Pet friendly"] },
                      ].map((habit) => (
                        <div key={habit.key} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{habit.label}</span>
                          {isEditingProfile ? (
                            <select
                              value={editFormData.lifestyle[habit.key]}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  lifestyle: { ...editFormData.lifestyle, [habit.key]: e.target.value },
                                })
                              }
                              className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-1.5 text-xs font-bold text-slate-800 outline-none"
                            >
                              {habit.options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="font-bold text-slate-800 text-xs mt-0.5">
                              {profile?.lifestyle?.[habit.key] || habit.options[1]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 6: Profile Photo Gallery */}
                  <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Profile Photos Gallery</span>
                      <span className="text-[10px] text-pink-600 font-bold">
                        {(isEditingProfile ? editFormData.photos.length : profile?.photos?.length || 1)} Photos
                      </span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(isEditingProfile ? editFormData.photos : profile?.photos || [
                        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop"
                      ]).map((photoSrc, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                          <img src={photoSrc} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 rounded-md bg-pink-600 px-2 py-0.5 text-[9px] font-black text-white shadow-sm">
                              Primary
                            </span>
                          )}
                          {isEditingProfile && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="cursor-pointer absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Photo Controls (in edit mode) */}
                    {isEditingProfile && (
                      <div className="pt-3 space-y-2.5 border-t border-slate-100">
                        <input
                          ref={photoFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUploadFileToCloudinary}
                          className="hidden"
                        />

                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <button
                            type="button"
                            onClick={() => photoFileInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-pink-50 border border-pink-200 px-4 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100 transition shadow-2xs shrink-0"
                          >
                            {isUploadingPhoto ? (
                              <>
                                <Loader2 size={15} className="animate-spin text-pink-600" />
                                <span>Uploading to Cloudinary...</span>
                              </>
                            ) : (
                              <>
                                <UploadCloud size={16} />
                                <span>Upload from Device (Cloudinary)</span>
                              </>
                            )}
                          </button>

                          <span className="text-xs font-bold text-slate-400">or</span>

                          <div className="flex items-center gap-1.5 w-full flex-1">
                            <input
                              type="url"
                              value={newPhotoUrl}
                              onChange={(e) => setNewPhotoUrl(e.target.value)}
                              placeholder="Paste image URL..."
                              className="flex-1 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-pink-500 focus:bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleAddPhoto}
                              className="cursor-pointer rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-pink-700 shrink-0"
                            >
                              Add URL
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SETTINGS                                                          */}
          {/* ========================================================================= */}
          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Account Settings</h2>
                <p className="text-sm text-slate-500">Configure your dating preferences and privacy controls</p>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Discovery Radius</h4>
                  <p className="text-xs text-slate-500">Maximum distance to show companion partners</p>
                  <input type="range" min="5" max="100" defaultValue="50" className="cursor-pointer w-full mt-3 accent-pink-600" />
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>5 km</span>
                    <span>50 km</span>
                    <span>100 km</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                    <p className="text-xs text-slate-500">Receive alerts when someone matches or messages you</p>
                  </div>
                  <input type="checkbox" defaultChecked className="cursor-pointer h-5 w-5 accent-pink-600" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Incognito Mode</p>
                    <p className="text-xs text-slate-500">Only people you like will be able to see your card</p>
                  </div>
                  <input type="checkbox" className="cursor-pointer h-5 w-5 accent-pink-600" />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-6 py-3 text-xs font-extrabold text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-xs active:scale-95"
                  >
                    <LogOut size={16} />
                    <span>Logout from this Device</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* 4. MOBILE BOTTOM NAVIGATION BAR                                          */}
        {/* ========================================================================= */}
        <nav
          className={`fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 items-center justify-around md:hidden z-30 shadow-lg ${activeTab === "messages" && mobileChatOpen ? "hidden" : "flex"
            }`}
        >
          {[
            { id: "dashboard", label: "Home", icon: Compass },
            { id: "discover", label: "Discover", icon: Search },
            { id: "likes", label: "Likes", icon: Heart, badge: likesCount > 0 ? likesCount : null },
            { id: "messages", label: "Chats", icon: MessageSquare, badge: totalUnreadCount > 0 ? totalUnreadCount : null },
            { id: "services", label: "Services", icon: CreditCard, badge: purchasedServices.length > 0 ? purchasedServices.length : null },
            { id: "profile", label: "Profile", icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`cursor-pointer relative flex flex-col items-center py-1.5 px-3 rounded-xl transition ${isActive ? "text-pink-600 font-bold" : "text-slate-500"
                  }`}
              >
                <Icon size={20} />
                <span className="text-[11px] mt-0.5">{item.label}</span>
                {item.badge ? (
                  <span className="absolute top-0.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-black text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 5. MATCH CELEBRATION MODAL                                               */}
      {/* ========================================================================= */}
      {matchedCelebrationModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl border border-pink-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white text-3xl shadow-lg shadow-pink-500/30 animate-bounce">
              💖
            </div>

            <h3 className="mt-4 text-2xl font-black text-slate-900">It's a Match!</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              You and <strong>{matchedCelebrationModal.name}</strong> liked each other!
            </p>

            <div className="my-5 flex items-center justify-center gap-3">
              <img
                src={
                  profile?.photos?.[0] ||
                  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=200&auto=format&fit=crop"
                }
                alt="Me"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-pink-500/40 shadow-md"
              />
              <span className="text-2xl font-black text-pink-500">✨</span>
              <img
                src={matchedCelebrationModal.photo}
                alt={matchedCelebrationModal.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-pink-500/40 shadow-md"
              />
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  const p = matchedCelebrationModal.person;
                  setMatchedCelebrationModal(null);
                  setPreviewPhotoIndex(0);
                  setPreviewProfileModal(p);
                }}
                className="cursor-pointer w-full rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 py-3 text-sm font-bold text-white shadow-md shadow-pink-500/25 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <User size={16} />
                <span>View Full Profile 👤</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const p = matchedCelebrationModal.person;
                  setMatchedCelebrationModal(null);
                  handleSelectChat(p);
                  handleTabChange("messages");
                }}
                className="cursor-pointer w-full rounded-2xl bg-pink-50 border border-pink-200 py-2.5 text-xs font-bold text-pink-700 hover:bg-pink-100 flex items-center justify-center gap-2"
              >
                <MessageSquare size={15} />
                <span>Chat Directly 💬</span>
              </button>

              <button
                type="button"
                onClick={() => setMatchedCelebrationModal(null)}
                className="cursor-pointer w-full rounded-2xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Keep Swiping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MATCH PROFILE DETAIL MODAL (Full Standard Dating Profile Inspection)   */}
      {/* ========================================================================= */}
      {previewProfileModal && (
        <div className="fixed inset-0 z-[450] flex items-center justify-center bg-slate-950/85 p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg md:max-w-4xl lg:max-w-5xl rounded-[32px] bg-white shadow-2xl overflow-hidden my-auto border border-slate-100 flex flex-col md:flex-row max-h-[95vh] md:h-[640px] animate-in fade-in zoom-in-95">
            {/* Left Side: Photo Carousel & Thumbnails Strip */}
            <div className="relative w-full md:w-[46%] lg:w-[48%] h-80 sm:h-96 md:h-full bg-slate-950 shrink-0 overflow-hidden group flex flex-col justify-between">
              {(() => {
                const photos =
                  previewProfileModal.photos && previewProfileModal.photos.length > 0
                    ? previewProfileModal.photos
                    : previewProfileModal.photo
                    ? [previewProfileModal.photo]
                    : ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop"];
                const currentPhoto = photos[previewPhotoIndex % photos.length];

                return (
                  <>
                    <div className="relative flex-1 w-full h-full overflow-hidden">
                      <img
                        src={currentPhoto}
                        alt={previewProfileModal.name || previewProfileModal.fullName}
                        className="h-full w-full object-cover transition duration-500"
                      />

                      {/* Photo Index Counter Pill */}
                      <div className="absolute top-4 left-4 z-30 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white flex items-center gap-1.5 shadow-sm">
                        <Camera size={13} className="text-pink-400" />
                        <span>{previewPhotoIndex + 1} / {photos.length}</span>
                      </div>

                      {/* Close button on mobile only */}
                      <button
                        onClick={() => setPreviewProfileModal(null)}
                        className="cursor-pointer md:hidden absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition"
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>

                      {/* Left / Right Photo Switchers */}
                      {photos.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
                            }}
                            className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 hover:scale-105 transition"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
                            }}
                            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 hover:scale-105 transition"
                          >
                            <ChevronRight size={20} />
                          </button>

                          {/* Top Indicator Bars */}
                          <div className="absolute top-4 inset-x-20 flex justify-center gap-1.5 z-20">
                            {photos.map((_, i) => (
                              <span
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewPhotoIndex(i);
                                }}
                                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                                  i === previewPhotoIndex % photos.length
                                    ? "w-8 bg-white shadow-md"
                                    : "w-2.5 bg-white/40 hover:bg-white/70"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />

                      {/* Identity on Photo (Bottom Left) */}
                      <div className="absolute bottom-3 left-4 right-4 z-20 text-white">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
                            {previewProfileModal.name || previewProfileModal.fullName}, {previewProfileModal.age || 24}
                          </h3>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white shadow-xs" title="Verified Profile">
                            ✓
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-200 flex items-center gap-1.5 font-medium drop-shadow-sm">
                          <MapPin size={13} className="text-pink-400 shrink-0" />
                          <span>{previewProfileModal.city || previewProfileModal.location?.city || "India"}</span>
                          {previewProfileModal.gender && (
                            <span className="text-white/70">• {previewProfileModal.gender}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Photo Thumbnails Strip (if multiple photos) */}
                    {photos.length > 1 && (
                      <div className="flex gap-2 p-2.5 bg-slate-950 border-t border-slate-900 overflow-x-auto shrink-0 z-20">
                        {photos.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPreviewPhotoIndex(idx)}
                            className={`relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              idx === previewPhotoIndex % photos.length
                                ? "border-pink-500 scale-105 shadow-md shadow-pink-500/30"
                                : "border-transparent opacity-50 hover:opacity-90"
                            }`}
                          >
                            <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Right Side: Header, Scrollable Details, and Sticky Action Footer */}
            <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden md:flex items-center justify-between p-5 pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-600">Active Member</span>
                  <span className="text-xs text-slate-300">•</span>
                  <span className="text-xs font-bold text-pink-600">Sathi Meet Verified ✓</span>
                </div>

                <button
                  onClick={() => setPreviewProfileModal(null)}
                  className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Details Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
                {/* 1. Quick Stats Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="rounded-2xl bg-pink-50/70 p-3 border border-pink-100/80 text-center">
                    <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider block">Gender</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                      {previewProfileModal.gender || "Female"}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-pink-50/70 p-3 border border-pink-100/80 text-center">
                    <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider block">Age</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                      {previewProfileModal.age || 24} yrs
                    </span>
                  </div>
                  <div className="rounded-2xl bg-pink-50/70 p-3 border border-pink-100/80 text-center">
                    <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider block">Height</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                      {previewProfileModal.height || "5' 5\""}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-pink-50/70 p-3 border border-pink-100/80 text-center">
                    <span className="text-[10px] font-extrabold text-pink-600 uppercase tracking-wider block">Status</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 block">
                      Matched 💖
                    </span>
                  </div>
                </div>

                {/* 2. About Me / Bio */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-pink-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">About Companion</h4>
                  </div>
                  <div className="relative rounded-2xl bg-gradient-to-br from-pink-50/40 via-slate-50 to-rose-50/30 p-4 border border-pink-100/60 shadow-2xs">
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      {previewProfileModal.bio ||
                        "Looking to make genuine and meaningful companion connections on Sathi Meet."}
                    </p>
                  </div>
                </div>

                {/* 3. Career & Education Section */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-pink-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Work &amp; Education</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-700 shrink-0">
                        <Briefcase size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          Profession
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {previewProfileModal.jobTitle || previewProfileModal.job || "Verified Professional"}
                        </p>
                        {previewProfileModal.company && (
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            at {previewProfileModal.company}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 shrink-0">
                        <GraduationCap size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                          Education
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {previewProfileModal.educationLevel || previewProfileModal.education || "Graduate Degree"}
                        </p>
                        {previewProfileModal.university && (
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {previewProfileModal.university}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Relationship Goals / Looking For */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Looking For</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(previewProfileModal.lookingFor && previewProfileModal.lookingFor.length > 0
                      ? previewProfileModal.lookingFor
                      : ["Long-term Relationship", "Meaningful Connection", "Romantic Dates", "Companion"]
                    ).map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200/80 px-3.5 py-1.5 text-xs font-extrabold text-pink-700 shadow-2xs"
                      >
                        <span>💖</span>
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. Passions & Interests */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-pink-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Passions &amp; Interests</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(previewProfileModal.tags || previewProfileModal.interests || ["Travel", "Coffee", "Music", "Art", "Movies"]).map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-2xl bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200 transition"
                        >
                          #{tag}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 6. Lifestyle & Habits */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span>✨</span>
                    <span>Lifestyle &amp; Daily Habits</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <span className="text-lg">🍷</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Drinking</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {previewProfileModal.lifestyle?.drinking || "Socially"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <span className="text-lg">🚭</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Smoking</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {previewProfileModal.lifestyle?.smoking || "Non-smoker"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <span className="text-lg">🏋️</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Workout</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {previewProfileModal.lifestyle?.workout || "Active"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <span className="text-lg">🥗</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Diet</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {previewProfileModal.lifestyle?.diet || "Flexible"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <span className="text-lg">🐾</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Pets</span>
                        <span className="text-xs font-bold text-slate-800 truncate block">
                          {previewProfileModal.lifestyle?.pets || "Pet friendly"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                      <span className="text-lg">🛡️</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">Verified ID</span>
                        <span className="text-xs font-bold text-sky-600 truncate block">
                          Sathi Verified ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Action Buttons Footer */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewProfileModal(null)}
                  className="cursor-pointer px-4 rounded-2xl bg-slate-100 py-3.5 text-xs font-extrabold text-slate-700 hover:bg-slate-200 transition"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const companion = previewProfileModal;
                    setPreviewProfileModal(null);
                    handleInitiateCall(companion, "audio");
                  }}
                  className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition shadow-xs shrink-0 active:scale-95"
                  title="Start HD Audio Call 📞"
                >
                  <Phone size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const companion = previewProfileModal;
                    setPreviewProfileModal(null);
                    handleInitiateCall(companion, "video");
                  }}
                  className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition shadow-xs shrink-0 active:scale-95"
                  title="Start HD Video Call 📹"
                >
                  <Video size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const matchItem = previewProfileModal;
                    setPreviewProfileModal(null);
                    handleSelectChat(matchItem);
                    handleTabChange("messages");
                  }}
                  className="cursor-pointer flex-1 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-pink-500/25 transition hover:brightness-110 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={17} />
                  <span>Start Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PREMIUM UPGRADE MODAL                                                  */}
      {/* ========================================================================= */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-pink-100">
            <button
              onClick={() => setShowPremiumModal(false)}
              className="cursor-pointer absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white shadow-lg shadow-pink-300/40">
                <Crown size={28} />
              </div>
              <h3 className="mt-3.5 text-2xl font-extrabold text-slate-900">Sathi Meet Gold ✨</h3>
              <p className="mt-1 text-xs text-slate-500">Unlock unlimited swipes, companion credits, and see who likes you</p>
            </div>

            <div className="mt-6 space-y-2.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2.5 rounded-2xl bg-pink-50/70 p-3">
                <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                <span>Unlimited Swipe Likes &amp; 5 Free Super Likes daily</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl bg-pink-50/70 p-3">
                <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                <span>See everyone who liked your profile instantly</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl bg-pink-50/70 p-3">
                <CheckCircle2 size={16} className="text-pink-600 shrink-0" />
                <span>Priority companion matching &amp; verified badge</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPremiumModal(false);
                showToast("🎉 Premium Gold activated on your account!");
              }}
              className="cursor-pointer mt-6 w-full rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-violet-600 py-3 text-sm font-bold text-white shadow-md shadow-pink-500/30 hover:brightness-110"
            >
              Upgrade for ₹99 / Month
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. REAL AUDIO & VIDEO CALLING MODALS (ZEGOCLOUD)                         */}
      {/* ========================================================================= */}
      {/* A. Incoming Call Modal (Ringing & Accept/Decline) */}
      {incomingCallData?.incomingCall && !activeCallSession && !outgoingCall && (
        <IncomingCallModal
          call={incomingCallData.incomingCall}
          onAccept={handleAcceptIncomingCall}
          onDecline={handleDeclineIncomingCall}
        />
      )}

      {/* B. Outgoing Call Modal (Dialing & Cancel) */}
      {outgoingCall && !activeCallSession && (
        <OutgoingCallModal
          companionName={outgoingCall.companionName}
          companionPhoto={outgoingCall.companionPhoto}
          callType={outgoingCall.callType}
          onCancel={handleCancelOutgoingCall}
        />
      )}

      {/* C. Active 1-on-1 ZEGOCLOUD Video/Audio Meeting Room */}
      {activeCallSession && (
        <CallContainer
          roomID={activeCallSession.roomID}
          userID={String(user?._id || user?.id || authState?.user?._id || authState?.user?.id || `user_${Math.floor(Math.random() * 1000)}`)}
          userName={String(userName || "Me")}
          userPhoto={profile?.photos?.[0] || user?.photos?.[0] || user?.photo || authState?.user?.photos?.[0]}
          companionName={activeCallSession.companionName}
          companionPhoto={activeCallSession.companionPhoto}
          callType={activeCallSession.callType}
          onEndCall={handleEndActiveCall}
        />
      )}
    </div>
  );
};

export default Dashboard;