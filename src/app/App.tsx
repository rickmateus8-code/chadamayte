import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "../components/common/Header";
import { HomePage } from "../pages/public/HomePage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer style={{
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "0.8125rem",
          color: "var(--color-text-muted)",
          borderTop: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}>
          Chá de Bebê da Maytê • &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </BrowserRouter>
  );
};
