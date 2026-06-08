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

// KEPT: Crucial imports for your simplified footer pages
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";
import ContactUsPage from "../pages/ContactUsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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