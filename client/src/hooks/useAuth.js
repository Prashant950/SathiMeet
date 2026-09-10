import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
  useAdminLoginMutation,
} from "../features/api/apiSlice";
import { logout as resetAuth, setAuthLoading, setCredentials } from "../features/auth/authSlice";

const STORAGE_KEY = "sathi-meet-auth-session";
const LEGACY_STORAGE_KEY = "spark-auth-session";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, role, status, error } = useSelector((state) => state.auth);

  const [registerUser, { isLoading: isRegistering, error: registerError }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoggingIn, error: loginError }] = useLoginUserMutation();
  const [adminLogin, { isLoading: isAdminLoggingIn, error: adminLoginError }] = useAdminLoginMutation();

  const persistSession = useCallback(async (authData) => {
    if (!authData?.token || !authData?.user) return;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
  }, []);

  const restoreSession = useCallback(async () => {
    try {
      let stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        stored = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      }

      if (!stored) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }

      const authData = JSON.parse(stored);

      if (authData?.token && authData?.user) {
        dispatch(setCredentials(authData));
        localStorage.setItem("token", authData.token);
        localStorage.setItem("user", JSON.stringify(authData.user));
        return authData;
      }

      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      console.error("Failed to restore auth session:", error);
      return null;
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  const signUp = useCallback(async (payload) => {
    const result = await registerUser(payload).unwrap();

    const authData = {
      token: result.token,
      user: result.user,
    };

    dispatch(setCredentials(authData));
    await persistSession(authData);

    return result;
  }, [dispatch, persistSession, registerUser]);

  const signIn = useCallback(async (payload) => {
    const result = await loginUser(payload).unwrap();

    const authData = {
      token: result.token,
      user: result.user,
    };

    dispatch(setCredentials(authData));
    await persistSession(authData);

    return result;
  }, [dispatch, loginUser, persistSession]);

  const adminSignIn = useCallback(async (payload) => {
    const result = await adminLogin(payload).unwrap();

    const authData = {
      token: result.token,
      user: result.user,
    };

    dispatch(setCredentials(authData));
    await persistSession(authData);

    return result;
  }, [adminLogin, dispatch, persistSession]);

  const signOut = useCallback(async () => {
    dispatch(resetAuth());
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, [dispatch]);

  return {
    token,
    user,
    role,
    isAuthenticated,
    status,
    error: error || registerError || loginError || adminLoginError,
    isRegistering,
    isLoggingIn,
    isAdminLoggingIn,
    restoreSession,
    signUp,
    signIn,
    adminSignIn,
    signOut,
    logout: signOut,
  };
};
