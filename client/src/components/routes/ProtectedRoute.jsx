// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const ProtectedRoute = ({ requiredRole = null }) => {
//   const { isAuthenticated, user, role } = useSelector((state) => state.auth);

//   if (!isAuthenticated || !user) {
//     return <Navigate to="/" replace />;
//   }

//   if (requiredRole && role !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole = null, redirectTo = "/" }) => {
  const { isAuthenticated, user, role, loading } = useSelector((state) => state.auth);

  // Initial token verification ya auth loading ke time loader dikhayein
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
      </div>
    );
  }

  // 1. Agar user logged in nahi hai
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Current user ka role check karein (state.auth.role ya user.role dono handle karega)
  const currentRole = role || user?.role;

  // 2. Agar specific role required hai (jaise 'admin') aur role match nahi hota
  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;