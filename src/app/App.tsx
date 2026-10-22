import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "../components/common/Header";
import { HomePage } from "../pages/public/HomePage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";

export const App: React.FC = () => {
  // SaaS Multi-tenant detection:
  // Access via admin.chadamayte.pages.dev or admin.* routes directly to Admin Dashboard
  const hostname = typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
  const isAdminSubdomain =
    hostname.startsWith("admin.") ||
    hostname.includes(".admin.") ||
    hostname === "admin.localhost";

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1 }}>
          {isAdminSubdomain ? (
            /* Subdomínio Administrativo SaaS: admin.{domínio}/{nomedochadebebe} */
            <Routes>
              <Route path="/" element={<AdminDashboardPage />} />
              <Route path="/:eventSlug" element={<AdminDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/:eventSlug" element={<AdminDashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            /* Domínio Principal & Convites Públicos */
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/i/:token" element={<HomePage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/:eventSlug" element={<AdminDashboardPage />} />
              <Route path="/:eventSlug/admin" element={<AdminDashboardPage />} />
              <Route path="/:eventSlug" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};
