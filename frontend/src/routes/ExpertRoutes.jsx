import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import ExpertDashboard from "../pages/expert/ExpertDashboard";
import AssignedSPUList from "../pages/expert/AssignedSPUList";
import ReputationScore from "../pages/expert/ReputationScore";
import VerificationForm from "../pages/expert/VerificationForm";

const ExpertRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route
        path="dashboard"
        element={
          <ProtectedRoute allowedRoles={["partner"]}>
            <ExpertDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="assigned-spu"
        element={
          <ProtectedRoute allowedRoles={["partner"]}>
            <AssignedSPUList />
          </ProtectedRoute>
        }
      />
      <Route
        path="reputation"
        element={
          <ProtectedRoute allowedRoles={["partner"]}>
            <ReputationScore />
          </ProtectedRoute>
        }
      />
      <Route
        path="verify-spu"
        element={
          <ProtectedRoute allowedRoles={["partner"]}>
            <VerificationForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default ExpertRoutes;
