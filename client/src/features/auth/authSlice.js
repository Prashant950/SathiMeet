import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  role: "guest",
  isAuthenticated: false,
  loading: true,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {};
      const nextUser = user || state.user;
      const nextRole = nextUser?.role || "user";

      state.token = token || state.token;
      state.user = nextUser;
      state.role = nextRole;
      state.isAuthenticated = Boolean(state.token && nextUser);
      state.loading = false;
      state.status = "succeeded";
      state.error = null;
    },
    setAuthState: (state, action) => {
      const { token, user, role } = action.payload || {};

      state.token = token || null;
      state.user = user || null;
      state.role = role || user?.role || "guest";
      state.isAuthenticated = Boolean(token && user);
      state.loading = false;
      state.status = "succeeded";
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = "guest";
      state.isAuthenticated = false;
      state.loading = false;
      state.status = "idle";
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload || "Authentication failed";
      state.status = "failed";
    },
    setAuthLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
  },
});

export const { setCredentials, setAuthState, logout, setAuthError, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
