// src/routes/LearnerRoutes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import LearnerDashboard from "../pages/learner/LearnerDashboard";
import SPUCard from "../pages/learner/SPUCard";
import CompetencyTimeline from "../pages/learner/CompetencyTimeline";
import PortforlioShareButton from "../pages/learner/PortfolioShareButton"

const LearnerRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["learner"]}>
      <Routes>
        <Route index element={<LearnerDashboard />} />
        <Route path="spu" element={<SPUCard />} />
        <Route path="competency" element={<CompetencyTimeline />} />
        <Route path="portfolio" element={<PortforlioShareButton />} />
      </Routes>
    </ProtectedRoute>
  );
};

export default LearnerRoutes;
