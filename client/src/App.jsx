import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PublicRoute from "./components/routes/PublicRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import HelpCenter from "./pages/HelpCenter";
import CodeOfConduct from "./pages/CodeOfConduct";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardOverview from "./components/admin/DashboardOverview";
import UserManagement from "./components/admin/UserManagement";
import Bookings from "./components/admin/Bookings";
import Payments from "./components/admin/Payments";
import ServiceCatalogAdmin from "./components/admin/ServiceCatalogAdmin";

function App() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <BrowserRouter>
      {/* Global Hot Toast Notification Provider (Top Right & Green Accent Card Theme) */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        containerStyle={{
          top: 20,
          right: 20,
          zIndex: 999999,
        }}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#0f172a",
            borderRadius: "14px",
            fontSize: "13px",
            fontWeight: "600",
            padding: "12px 18px",
            boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)",
            border: "1px solid #f1f5f9",
            borderLeft: "6px solid #10b981", // Solid Green Accent bar on left edge like screenshot
            zIndex: 999999,
          },
          success: {
            duration: 3500,
            style: {
              borderLeft: "6px solid #10b981",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            duration: 4000,
            style: {
              borderLeft: "6px solid #f43f5e",
            },
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/code-of-conduct" element={<CodeOfConduct />} />

        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/user-login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>

        <Route path="/services" element={<Services />} />

        {/* User Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="user" redirectTo="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/onboarding" element={<Onboarding />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" redirectTo="/admin-login" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="payments" element={<Payments />} />
            <Route path="services" element={<ServiceCatalogAdmin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;