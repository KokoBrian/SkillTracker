import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import SPUForm from "../pages/teacher/SPUForm";
import EndorsementForm from "../pages/teacher/EndorsementForm";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={<Navigate to="dashboard" replace />}
      />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="spu-form"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <SPUForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="endorsement-form"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <EndorsementForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default TeacherRoutes;
