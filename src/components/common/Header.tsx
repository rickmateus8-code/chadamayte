import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown, Sparkles, Settings } from "lucide-react";

export const Header: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header style={{
      backgroundColor: "var(--color-surface)",
      borderBottom: "1px solid var(--color-border)",
      padding: "0.75rem 1.5rem",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-gold)",
          }}>
            <Crown size={20} />
          </div>
          <div>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--color-text-main)",
              letterSpacing: "0.02em",
            }}>
              Maytê
            </span>
            <span style={{
              display: "block",
              fontSize: "0.6875rem",
              color: "var(--color-gold)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}>
              Chá de Bebê
            </span>
          </div>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            to="/"
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.875rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: !isAdmin ? "var(--color-primary-light)" : "transparent",
              color: !isAdmin ? "var(--color-primary-dark)" : "var(--color-text-muted)",
              fontWeight: !isAdmin ? 600 : 500,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Sparkles size={15} />
            Início
          </Link>
          <Link
            to="/admin"
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.875rem",
              borderRadius: "var(--radius-sm)",
              backgroundColor: isAdmin ? "var(--color-primary-light)" : "transparent",
              color: isAdmin ? "var(--color-primary-dark)" : "var(--color-text-muted)",
              fontWeight: isAdmin ? 600 : 500,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Settings size={15} />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};
