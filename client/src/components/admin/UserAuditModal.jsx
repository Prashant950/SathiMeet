import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Heart,
  Phone,
  MessageSquare,
  Package,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Clock,
  Video,
  Mic,
  Camera,
  Edit3,
  Save,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  ExternalLink,
  ChevronRight,
  FileText,
  DollarSign,
  Sparkles,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetUserAuditDetailsQuery,
  useUpdateUserAuditDetailsMutation,
  useUpdateUserMutation
} from "../../features/api/apiSlice";

const UserAuditModal = ({ userId, onClose, onUserUpdated }) => {
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "likes" | "calls" | "chats" | "bookings"
  const [isEditing, setIsEditing] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [swipeFilter, setSwipeFilter] = useState("all");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const { data: auditData, isLoading, isFetching, refetch } = useGetUserAuditDetailsQuery(userId, {
    skip: !userId,
  });

  const [updateUserAuditDetails, { isLoading: isSaving }] = useUpdateUserAuditDetailsMutation();
  const [updateUserStatus] = useUpdateUserMutation();

  const audit = auditData?.data || {};
  const user = audit.user || {};
  const profile = audit.profile || {};
  const outgoing = audit.outgoingInteractions || [];
  const incoming = audit.incomingInteractions || [];
  const calls = audit.calls || [];
  const conversations = audit.conversations || [];
  const bookings = audit.bookings || [];
  const payments = audit.payments || [];

  // Form State for Editing
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    role: "user",
    isBlocked: false,
    isProfileCompleted: false,
    age: "",
    gender: "Female",
    city: "",
    state: "",
    bio: "",
    jobTitle: "",
    company: "",
    educationLevel: "",
    university: "",
    interests: [],
    lookingFor: [],
    photos: [],
  });

  useEffect(() => {
    if (user._id) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        role: user.role || "user",
        isBlocked: !!user.isBlocked,
        isProfileCompleted: !!user.isProfileCompleted,
        age: profile.age || "",
        gender: profile.gender || "Female",
        city: profile.location?.city || "",
        state: profile.location?.state || "",
        bio: profile.bio || "",
        jobTitle: profile.jobTitle || "",
        company: profile.company || "",
        educationLevel: profile.educationLevel || "",
        university: profile.university || "",
        interests: profile.interests || [],
        lookingFor: profile.lookingFor || [],
        photos: profile.photos || [],
      });
    }
  }, [user, profile]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Handle Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserAuditDetails({
        id: userId,
        ...formData,
      }).unwrap();
      toast.success("✅ User details updated successfully!");
      setIsEditing(false);
      refetch();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      toast.error(err.data?.message || err.message || "Failed to update user details");
    }
  };

  // Toggle Block Status
  const handleToggleBlock = async () => {
    try {
      await updateUserStatus({
        id: userId,
        isBlocked: !user.isBlocked,
      }).unwrap();
      toast.success(!user.isBlocked ? "User blocked successfully" : "User unblocked successfully");
      refetch();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Photo handlers
  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, newPhotoUrl.trim()],
    }));
    setNewPhotoUrl("");
  };

  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Format Helper
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Likes & Swipes filtering
  const allSwipes = [
    ...outgoing.map((item) => ({ ...item, direction: "outgoing" })),
    ...incoming.map((item) => ({ ...item, direction: "incoming" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredSwipes = allSwipes.filter((s) => {
    if (swipeFilter === "liked") return s.action === "like" || s.action === "superlike";
    if (swipeFilter === "passed") return s.action === "pass";
    if (swipeFilter === "incoming") return s.direction === "incoming";
    if (swipeFilter === "matched") return s.status === "matched";
    return true;
  });

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        
        {/* ========================================================================= */}
        {/* 1. MODAL TOP HEADER                                                       */}
        {/* ========================================================================= */}
        <div className="relative px-5 py-4 sm:px-8 sm:py-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative h-13 w-13 sm:h-15 sm:w-15 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-pink-600 ring-2 ring-pink-500/50 shrink-0 flex items-center justify-center text-white text-xl font-black shadow-md">
              {formData.photos?.[0] ? (
                <img
                  src={formData.photos[0]}
                  alt={formData.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{(formData.fullName || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black truncate text-white">
                  {formData.fullName || "Unnamed User"}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    user.isBlocked
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {user.isBlocked ? <Ban size={11} /> : <CheckCircle2 size={11} />}
                  <span>{user.isBlocked ? "Blocked" : "Active"}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  {user.role || "User"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                <span>📧 {user.email || "No email"}</span>
                <span>📞 {user.contactNumber || "No phone"}</span>
                <span>📅 Joined: {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={refetch}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin text-pink-400" : ""} />
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                isEditing
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:brightness-110"
              }`}
            >
              <Edit3 size={14} />
              <span>{isEditing ? "View Mode" : "Edit Profile"}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleBlock}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                user.isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              <Ban size={14} />
              <span>{user.isBlocked ? "Unblock" : "Block"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. NAVIGATION TABS BAR                                                     */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2.5 bg-slate-100/90 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold">
          {[
            { id: "profile", label: "Profile & Photos", icon: User, badge: formData.photos?.length },
            { id: "likes", label: "Likes & Swipes", icon: Heart, badge: allSwipes.length },
            { id: "calls", label: "Audio & Video Calls", icon: Phone, badge: calls.length },
            { id: "chats", label: "Chat Conversations", icon: MessageSquare, badge: conversations.length },
            { id: "bookings", label: "Services & Payments", icon: Package, badge: bookings.length + payments.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-white text-pink-600 shadow-sm border border-slate-200/80 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Icon size={15} className={active ? "text-pink-600" : "text-slate-400"} />
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      active ? "bg-pink-100 text-pink-700 font-black" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. TAB CONTENT VIEWS                                                      */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f8fafc]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw size={28} className="animate-spin text-pink-600" />
              <p className="text-xs font-bold text-slate-500">Loading comprehensive user audit logs...</p>
            </div>
          ) : (
            <>
              {/* ========================================================================= */}
              {/* TAB 1: PROFILE & PHOTOS (EDITABLE)                                        */}
              {/* ========================================================================= */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-5xl mx-auto">
                  {/* Photo Gallery Grid */}
                  <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <Camera size={18} className="text-pink-600" />
                          <span>Profile Photos Gallery ({formData.photos?.length || 0})</span>
                        </h3>
                        <p className="text-xs text-slate-500">All photos uploaded by this companion user</p>
                      </div>
                    </div>

                    {/* Photos Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {formData.photos?.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-xs hover:border-pink-500 transition"
                        >
                          <img
                            src={photoUrl}
                            alt={`Photo ${idx + 1}`}
                            className="h-full w-full object-cover cursor-pointer transition group-hover:scale-105"
                            onClick={() => setPreviewPhoto(photoUrl)}
                          />
                          <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white px-2 py-0.5 rounded-md">
                            #{idx + 1}
                          </span>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="cursor-pointer absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-md transition"
                              title="Delete Photo"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Photo Input when editing */}
                      {isEditing && (
                        <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50/40 p-3 flex flex-col justify-center items-center text-center gap-2">
                          <Plus size={20} className="text-pink-600" />
                          <input
                            type="text"
                            placeholder="Image URL..."
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            className="w-full rounded-lg border border-pink-200 bg-white p-1 text-[11px] text-slate-800 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAddPhoto}
                            className="cursor-pointer w-full rounded-lg bg-pink-600 py-1 text-[10px] font-bold text-white hover:bg-pink-700"
                          >
                            Add Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Fields (View / Edit Mode) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Account Info */}
                    <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <User size={16} className="text-pink-600" />
                        <span>Basic Account Credentials</span>
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
                          <input
                            type="email"
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Phone / Contact</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500 focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Account Role</label>
                            <select
                              disabled={!isEditing}
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-pink-500"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">KYC / Onboarding</label>
                            <select
                              disabled={!isEditing}
                              value={formData.isProfileCompleted ? "true" : "false"}
                              onChange={(e) => setFormData({ ...formData, isProfileCompleted: e.target.value === "true" })}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-pink-500"
                            >
                              <option value="true">Completed ✅</option>
                              <option value="false">Pending ⏳</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dating & Companion Profile Info */}
                    <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Sparkles size={16} className="text-pink-600" />
                        <span>Companion Persona &amp; Demographics</span>
                      </h4>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Age</label>
                            <input
                              type="number"
                              disabled={!isEditing}
                              value={formData.age}
                              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
                            <select
                              disabled={!isEditing}
                              value={formData.gender}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-pink-500"
                            >
                              <option value="Female">Female</option>
                              <option value="Male">Male</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
                            <input
                              type="text"
                              disabled={!isEditing}
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">State</label>
                            <input
                              type="text"
                              disabled={!isEditing}
                              value={formData.state}
                              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Job / Profession</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Education / College</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={formData.educationLevel}
                            onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1">Bio / About Me</label>
                          <textarea
                            rows={3}
                            disabled={!isEditing}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 disabled:bg-slate-100/70 p-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button when Editing */}
                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="cursor-pointer rounded-2xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-8 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/25 hover:brightness-110 transition disabled:opacity-50"
                      >
                        {isSaving && <RefreshCw size={14} className="animate-spin" />}
                        <Save size={15} />
                        <span>Save Profile Changes</span>
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: LIKES, DISLIKES & SWIPES                                           */}
              {/* ========================================================================= */}
              {activeTab === "likes" && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-slate-400">Total Swipes Given</p>
                      <p className="text-xl font-black text-slate-900 mt-1">{outgoing.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-pink-600">Profiles Liked ❤️</p>
                      <p className="text-xl font-black text-pink-600 mt-1">
                        {outgoing.filter((s) => s.action === "like" || s.action === "superlike").length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-slate-500">Profiles Passed ❌</p>
                      <p className="text-xl font-black text-slate-700 mt-1">
                        {outgoing.filter((s) => s.action === "pass").length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-violet-600">Incoming Likes 💌</p>
                      <p className="text-xl font-black text-violet-600 mt-1">{incoming.length}</p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "all", label: "All Swipes" },
                      { id: "liked", label: "Liked ❤️" },
                      { id: "passed", label: "Passed ❌" },
                      { id: "incoming", label: "Who Liked Them 💌" },
                      { id: "matched", label: "Mutual Matches ✨" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSwipeFilter(f.id)}
                        className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                          swipeFilter === f.id
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Swipes List */}
                  {filteredSwipes.length === 0 ? (
                    <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
                      <Heart size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-700">No swipe activity in this filter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredSwipes.map((swipe, idx) => {
                        const isOutgoing = swipe.direction === "outgoing";
                        const person = isOutgoing ? swipe.targetUserId : swipe.userId;
                        const actionName =
                          swipe.action === "like"
                            ? "Liked"
                            : swipe.action === "superlike"
                            ? "Superliked ⭐"
                            : "Passed ❌";

                        return (
                          <div
                            key={idx}
                            className="rounded-2xl bg-white p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 hover:border-pink-300 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-violet-100 text-sm font-black text-pink-700">
                                {(person?.fullName || "P").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">
                                  {person?.fullName || "Companion User"}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {person?.email || person?.contactNumber || "ID Verified"}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  swipe.action === "like"
                                    ? "bg-pink-100 text-pink-700"
                                    : swipe.action === "superlike"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {isOutgoing ? `Swiped: ${actionName}` : `Received: ${actionName}`}
                              </span>
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1 font-medium">
                                <Clock size={10} />
                                <span>{formatDate(swipe.createdAt)}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: AUDIO & VIDEO CALLS LOGS                                          */}
              {/* ========================================================================= */}
              {activeTab === "calls" && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Phone size={18} className="text-pink-600" />
                        <span>Audio &amp; Video Calling History ({calls.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Exact records of who called whom, timestamps, call types, and total durations
                      </p>
                    </div>
                  </div>

                  {calls.length === 0 ? (
                    <div className="rounded-3xl bg-white p-12 text-center border border-slate-200">
                      <Phone size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-700">No audio or video call logs found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {calls.map((call, idx) => {
                        const isCaller = String(call.callerId) === String(userId);
                        const otherPersonName = isCaller ? call.receiverName : call.callerName;
                        const otherPersonPhoto = isCaller ? call.receiverPhoto : call.callerPhoto;
                        const isVideo = call.callType === "video";

                        const mins = Math.floor((call.duration || 0) / 60);
                        const secs = (call.duration || 0) % 60;
                        const durText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                        return (
                          <div
                            key={call._id || idx}
                            className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-300 transition"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                {otherPersonPhoto ? (
                                  <img
                                    src={otherPersonPhoto}
                                    alt={otherPersonName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-violet-100 text-violet-700 font-bold text-sm">
                                    {(otherPersonName || "C").charAt(0)}
                                  </div>
                                )}
                                <span
                                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                                    isVideo ? "bg-purple-600" : "bg-emerald-500"
                                  }`}
                                />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-extrabold text-slate-900">
                                    {otherPersonName || "Companion User"}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {isCaller ? (
                                      <span className="inline-flex items-center gap-1 text-pink-600 font-bold">
                                        <ArrowUpRight size={13} />
                                        <span>Outgoing</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                                        <ArrowDownLeft size={13} />
                                        <span>Incoming</span>
                                      </span>
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                  <span className="font-semibold flex items-center gap-1">
                                    {isVideo ? <Video size={13} className="text-purple-600" /> : <Mic size={13} className="text-emerald-600" />}
                                    <span>{isVideo ? "HD Video Call" : "Audio Call"}</span>
                                  </span>
                                  <span>•</span>
                                  <span>Room: {call.roomID}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    call.status === "ended" || call.status === "accepted"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : call.status === "missed"
                                      ? "bg-rose-100 text-rose-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {call.status === "ended" ? `Completed • ${durText}` : call.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                                <Clock size={10} />
                                <span>{formatDate(call.createdAt)}</span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: CHAT CONVERSATIONS & MESSAGES                                      */}
              {/* ========================================================================= */}
              {activeTab === "chats" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto h-[60vh]">
                  {/* Left Conversations List */}
                  <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden flex flex-col shadow-xs">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        All Chat Threads ({conversations.length})
                      </h4>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                      {conversations.length === 0 ? (
                        <p className="p-8 text-center text-xs text-slate-400">No chats started yet</p>
                      ) : (
                        conversations.map((conv) => {
                          const partner = conv.participants?.find((p) => String(p._id) !== String(userId)) || conv.participants?.[0];
                          const isSelected = selectedConversation?._id === conv._id;

                          return (
                            <button
                              key={conv._id}
                              type="button"
                              onClick={() => setSelectedConversation(conv)}
                              className={`w-full text-left p-3.5 transition flex items-center gap-3 cursor-pointer ${
                                isSelected ? "bg-pink-50/80 border-l-4 border-pink-600" : "hover:bg-slate-50"
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {(partner?.fullName || "C").charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {partner?.fullName || "Companion"}
                                  </p>
                                  <span className="text-[10px] text-slate-400">
                                    {conv.messages?.length || 0} msgs
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                  {conv.lastMessage || "Click to view transcript"}
                                </p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Chat Transcript View */}
                  <div className="md:col-span-2 rounded-3xl bg-white border border-slate-200 overflow-hidden flex flex-col shadow-xs">
                    {selectedConversation ? (
                      <>
                        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-black text-slate-900">
                              Chat Transcript with{" "}
                              {selectedConversation.participants?.find((p) => String(p._id) !== String(userId))?.fullName || "Companion"}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              Total {selectedConversation.messages?.length || 0} messages exchanged
                            </p>
                          </div>
                        </div>

                        {/* Messages Feed */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2] flex flex-col">
                          {selectedConversation.messages?.length === 0 ? (
                            <p className="text-center my-auto text-xs text-slate-400">No messages in this chat thread</p>
                          ) : (
                            selectedConversation.messages?.map((msg, i) => {
                              const isMe = String(msg.senderId) === String(userId);
                              return (
                                <div
                                  key={msg._id || i}
                                  className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                                      isMe ? "bg-[#d9fdd3] text-slate-900 rounded-tr-xs" : "bg-white text-slate-900 rounded-tl-xs"
                                    }`}
                                  >
                                    <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                                      <span>{formatDate(msg.createdAt)}</span>
                                      {isMe && <span>• Sent by User</span>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400">
                        <MessageSquare size={32} className="mb-2" />
                        <p className="text-xs font-bold">Select a conversation thread to view transcript</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: SERVICES & PAYMENTS BOOKINGS                                       */}
              {/* ========================================================================= */}
              {activeTab === "bookings" && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-slate-400">Total Bookings</p>
                      <p className="text-xl font-black text-slate-900 mt-1">{bookings.length}</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-emerald-600">Total Spent</p>
                      <p className="text-xl font-black text-emerald-600 mt-1">
                        ₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-2xs">
                      <p className="text-xs font-bold text-violet-600">Completed Payments</p>
                      <p className="text-xl font-black text-violet-600 mt-1">
                        {payments.filter((p) => p.status === "completed").length}
                      </p>
                    </div>
                  </div>

                  {/* Bookings & Invoices Table */}
                  <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Transactions &amp; Service Credits
                      </h4>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[10px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="px-5 py-3">Services</th>
                            <th className="px-5 py-3">Order ID / Payment ID</th>
                            <th className="px-5 py-3">Amount</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {payments.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="py-8 text-center text-slate-400">
                                No payment or booking transactions recorded.
                              </td>
                            </tr>
                          ) : (
                            payments.map((p) => (
                              <tr key={p._id} className="hover:bg-slate-50/80 transition">
                                <td className="px-5 py-3.5 font-bold text-slate-900">
                                  {p.services?.map((s) => s.title).join(", ") || "Companion Service Session"}
                                </td>
                                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                                  <div>Order: {p.orderId || "N/A"}</div>
                                  <div className="text-slate-400">PayID: {p.paymentId || "rzp_verified"}</div>
                                </td>
                                <td className="px-5 py-3.5 font-black text-pink-600 text-sm">
                                  ₹{p.amount?.toLocaleString("en-IN") || 0}
                                </td>
                                <td className="px-5 py-3.5">{formatDate(p.createdAt)}</td>
                                <td className="px-5 py-3.5">
                                  <span
                                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                      p.status === "completed"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {p.status || "Completed"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* Full Resolution Photo Lightbox */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 p-4 flex items-center justify-center animate-in fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewPhoto(null)}
            className="cursor-pointer absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full hover:bg-white/30"
          >
            <X size={24} />
          </button>
          <img
            src={previewPhoto}
            alt="Preview"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default UserAuditModal;
