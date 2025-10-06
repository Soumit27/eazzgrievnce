// // src/routes/ProtectedRoute.tsx
// import { Navigate } from "react-router-dom";

// export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const token = sessionStorage.getItem("access_token");
//   if (!token) return <Navigate to="/login" />;
//   return children;
// };




// routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // optional: if not provided, any logged-in user can access
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const role = sessionStorage.getItem("role")?.toUpperCase();

  // Not logged in
  if (!role) return <Navigate to="/login" replace />;

  // Role restriction
  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
