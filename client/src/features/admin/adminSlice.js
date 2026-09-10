import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  status: "idle",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminProfile: (state, action) => {
      state.admin = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearAdminProfile: (state) => {
      state.admin = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setAdminProfile, clearAdminProfile } = adminSlice.actions;
export default adminSlice.reducer;
