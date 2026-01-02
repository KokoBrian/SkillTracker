import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/auth/Unauthorized";
import NotFound from "../pages/NotFound";

import AdminRoutes from "./AdminRoutes";
import TeacherRoutes from "./TeacherRoutes";
import LearnerRoutes from "./LearnerRoutes";
import ExpertRoutes from "./ExpertRoutes";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/teacher/*" element={<TeacherRoutes />} />
    <Route path="/learner/*" element={<LearnerRoutes />} />
    <Route path="/expert/*" element={<ExpertRoutes />} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
