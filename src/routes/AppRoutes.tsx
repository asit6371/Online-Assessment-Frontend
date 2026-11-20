import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import QuestionPage from "../pages/QuestionPage";
import ResultPage from "../pages/ResultPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import CreateQuestionPage from "../pages/CreateQuestionPage";
import CreateTestPage from "../pages/CreateTestPage";
import TestDetailsPage from "../pages/TestDetailsPage";
import ProtectedRoute from "./ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";
import LandingPage from "../pages/LandingPage";
import OverviewPage from "../pages/OverviewPage";

import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";
import ContactUsPage from "../pages/ContactUsPage";

// System Design Platform Pages
import SystemDesignHomePage from "../pages/system-design/SystemDesignHomePage";
import SystemDesignTrackPage from "../pages/system-design/SystemDesignTrackPage";
import TopicLearningPage from "../pages/system-design/TopicLearningPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* System Design Routes — Protected */}
        <Route
          path="/system-design"
          element={
            <ProtectedRoute>
              <SystemDesignHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-design/lld"
          element={
            <ProtectedRoute>
              <SystemDesignTrackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-design/hld"
          element={
            <ProtectedRoute>
              <SystemDesignTrackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-design/track/:trackId"
          element={
            <ProtectedRoute>
              <SystemDesignTrackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-design/lld/topic/:topicId"
          element={
            <ProtectedRoute>
              <TopicLearningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-design/hld/topic/:topicId"
          element={
            <ProtectedRoute>
              <TopicLearningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-design/topic/:topicId"
          element={
            <ProtectedRoute>
              <TopicLearningPage />
            </ProtectedRoute>
          }
        />

        {/* KEPT: Legal static pages from your footer links */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/contact" element={<ContactUsPage />} />

        {/* Assessment session route — new flow */}
        <Route
          path="/assessment/:sessionId"
          element={
            <ProtectedRoute>
              <QuestionPage />
            </ProtectedRoute>
          }
        />

         {/* Overview Route */}
                <Route
                  path="/overview"
                  element={
                    <ProtectedRoute>
                      <OverviewPage />
                    </ProtectedRoute>
                  }
                />

        {/* Legacy routes — kept intact for backward compatibility */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question/:id"
          element={
            <ProtectedRoute>
              <QuestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute>
              <CreateQuestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tests"
          element={
            <ProtectedRoute>
              <CreateTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/:id"
          element={
            <ProtectedRoute>
              <TestDetailsPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;