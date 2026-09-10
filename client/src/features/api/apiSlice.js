import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    let token = getState()?.auth?.token;

    if (!token) {
      try {
        const stored =
          localStorage.getItem("sathi-meet-auth-session") ||
          localStorage.getItem("spark-auth-session");
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed?.token;
        }
        if (!token) {
          token = localStorage.getItem("token");
        }
      } catch (e) {
        // ignore parsing error
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, apiInstance, extraOptions) => {
  const result = await rawBaseQuery(args, apiInstance, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.originalStatus === 401)) {
    const url = typeof args === "string" ? args : args?.url || "";
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");

    if (!isAuthRoute) {
      try {
        localStorage.removeItem("sathi-meet-auth-session");
        localStorage.removeItem("spark-auth-session");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {
        // ignore
      }
      apiInstance.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Admin",
    "Users",
    "Analytics",
    "Bookings",
    "Services",
    "Transactions",
    "DatingFeed",
    "Matches",
    "Likes",
    "Conversations",
  ],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/register",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    adminLogin: builder.mutation({
      query: (payload) => ({
        url: "/auth/admin-login",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: "/profile/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    // Payment-related endpoints
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/payment/create-order",
        method: "POST",
        body: payload,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (payload) => ({
        url: "/payment/verify-payment",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    getPaymentDetails: builder.query({
      query: (paymentId) => ({
        url: `/payment/payment/${paymentId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserPayments: builder.query({
      query: () => ({
        url: "/payment/my-payments",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getMyPurchasedServices: builder.query({
      query: () => ({
        url: "/profile/my-services",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    // Additional endpoints for admin functionalities can be added here
    getAnalytics: builder.query({
      query: () => "/admin/analytics",
      providesTags: ["Analytics"],
    }),
    // Users
    getUsers: builder.query({
      query: ({ page = 1, search = "", role = "" } = {}) =>
        `/admin/users?page=${page}&search=${encodeURIComponent(search)}&role=${encodeURIComponent(role)}`,
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users", "Analytics"],
    }),
    getUserAuditDetails: builder.query({
      query: (userId) => `/admin/users/${userId}/audit-details`,
      providesTags: ["Users"],
    }),
    updateUserAuditDetails: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}/audit-update`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users", "Analytics"],
    }),
    // Bookings
    getBookings: builder.query({
      query: ({ page = 1, status = "", paymentStatus = "" }) =>
        `/admin/bookings?page=${page}&status=${encodeURIComponent(status)}&paymentStatus=${encodeURIComponent(paymentStatus)}`,
      providesTags: ["Bookings"],
    }),
    updateBooking: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/bookings/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Bookings", "Analytics"],
    }),
    // Services Catalog
    getPublicServicesCatalog: builder.query({
      query: () => "/payment/catalog",
      providesTags: ["Services"],
    }),
    getServices: builder.query({
      query: () => "/admin/services",
      providesTags: ["Services"],
    }),
    createService: builder.mutation({
      query: (body) => ({
        url: "/admin/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services", "Analytics"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Services"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/admin/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services", "Analytics"],
    }),
    // Transactions
    getTransactions: builder.query({
      query: () => "/admin/transactions",
      providesTags: ["Transactions"],
    }),
    // admin profile
    getProfile: builder.query({
      query: () => "/admin/me",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/admin/update-profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            const STORAGE_KEY = "sathi-meet-auth-session";
            const LEGACY_STORAGE_KEY = "spark-auth-session";
            const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
            if (stored) {
              const session = JSON.parse(stored);
              session.user = { ...session.user, ...data.user };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            }
          }
        } catch {
          // Mutation error will be handled by the UI component
        }
      },
    }),
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: "/admin/change-password",
        method: "PUT",
        body: passwords,
      }),
      invalidatesTags: ["User"],
    }),

    // Real Dating, Discovery & Matches Endpoints
    getDiscoveryProfiles: builder.query({
      query: () => ({
        url: "/profiles/discovery",
        method: "GET",
      }),
      providesTags: ["DatingFeed"],
    }),
    getMatchesAndLikes: builder.query({
      query: () => ({
        url: "/profiles/matches",
        method: "GET",
      }),
      providesTags: ["Matches", "Likes"],
    }),
    swipeProfile: builder.mutation({
      query: ({ targetUserId, action }) => ({
        url: "/interactions/swipe",
        method: "POST",
        body: { targetUserId, action },
      }),
      invalidatesTags: ["DatingFeed", "Matches", "Likes"],
    }),
    likeBack: builder.mutation({
      query: ({ interactionId, targetUserId }) => ({
        url: "/interactions/like-back",
        method: "POST",
        body: { interactionId, targetUserId },
      }),
      invalidatesTags: ["DatingFeed", "Matches", "Likes", "Conversations"],
    }),
    getConversations: builder.query({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      providesTags: ["Conversations"],
    }),
    getConversationById: builder.query({
      query: (id) => ({
        url: `/conversations/${id}`,
        method: "GET",
      }),
      providesTags: ["Conversations"],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, text }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Conversations"],
    }),
    markConversationRead: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Conversations"],
    }),
    getOrCreateConversationWithUser: builder.mutation({
      query: (otherUserId) => ({
        url: `/conversations/with-user/${otherUserId}`,
        method: "POST",
      }),
      invalidatesTags: ["Conversations"],
    }),
    updateMyProfile: builder.mutation({
      query: (body) => ({
        url: "/profile/me",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User", "DatingFeed"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user || data?.profile) {
            const STORAGE_KEY = "sathi-meet-auth-session";
            const LEGACY_STORAGE_KEY = "spark-auth-session";
            const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
            if (stored) {
              const session = JSON.parse(stored);
              session.user = {
                ...session.user,
                ...(data.user || {}),
                fullName: data.profile?.fullName || data.user?.fullName || session.user?.fullName,
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            }
          }
        } catch {}
      },
    }),
    uploadImage: builder.mutation({
      query: (body) => ({
        url: "/upload/image",
        method: "POST",
        body,
      }),
    }),
    // Real-Time Audio / Video Call Signaling
    startCall: builder.mutation({
      query: ({ receiverId, callType }) => ({
        url: "/conversations/call/start",
        method: "POST",
        body: { receiverId, callType },
      }),
    }),
    getIncomingCall: builder.query({
      query: () => ({
        url: "/conversations/call/incoming",
        method: "GET",
      }),
    }),
    getCallStatus: builder.query({
      query: (callId) => ({
        url: `/conversations/call/status/${callId}`,
        method: "GET",
      }),
    }),
    respondCall: builder.mutation({
      query: ({ callId, action }) => ({
        url: "/conversations/call/respond",
        method: "POST",
        body: { callId, action },
      }),
    }),
    endCall: builder.mutation({
      query: ({ callId }) => ({
        url: "/conversations/call/end",
        method: "POST",
        body: { callId },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useAdminLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadImageMutation,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPaymentDetailsQuery,
  useGetUserPaymentsQuery,
  useGetMyPurchasedServicesQuery,

  // Dating & Interaction hooks
  useGetDiscoveryProfilesQuery,
  useGetMatchesAndLikesQuery,
  useSwipeProfileMutation,
  useLikeBackMutation,
  useGetConversationsQuery,
  useGetConversationByIdQuery,
  useSendMessageMutation,
  useMarkConversationReadMutation,
  useGetOrCreateConversationWithUserMutation,

  // Calling hooks
  useStartCallMutation,
  useGetIncomingCallQuery,
  useGetCallStatusQuery,
  useRespondCallMutation,
  useEndCallMutation,

  // admin hooks
  useGetAnalyticsQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useGetUserAuditDetailsQuery,
  useUpdateUserAuditDetailsMutation,
  useGetBookingsQuery,
  useUpdateBookingMutation,
  useGetPublicServicesCatalogQuery,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetTransactionsQuery,
  // Admin profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = api;
