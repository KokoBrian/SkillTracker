import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AdminRoutes = () => (
  <Routes>
    <Route
      index
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    {/* Add more admin routes here */}
    <Route path="*" element={<Navigate to="" />} />
  </Routes>
);

export default AdminRoutes;
