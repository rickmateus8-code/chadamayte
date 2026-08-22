import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "../brand/Crown";
import { Sparkles, Settings } from "lucide-react";

export const Header: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <header style={{
      backgroundColor: "rgba(255, 249, 250, 0.85)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      borderBottom: "1px solid var(--color-border-delicate)",
      padding: "0.75rem 1.25rem",
      position: "sticky",
      top: 0,
      zIndex: "var(--z-header)" as unknown as number,
    }}>
      <div style={{
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-bg-soft)",
            border: "1px solid var(--color-pink-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Crown size={22} color="var(--color-gold)" />
          </div>
          <div>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--color-text)",
              letterSpacing: "0.02em",
              display: "block",
              lineHeight: 1.1,
            }}>
              Maytê
            </span>
            <span style={{
              display: "block",
              fontSize: "0.6875rem",
              color: "var(--color-gold-deep)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 600,
            }}>
              Chá de Bebê
            </span>
          </div>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            to="/"
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-full)",
              backgroundColor: !isAdmin ? "var(--color-bg-soft)" : "transparent",
              color: !isAdmin ? "var(--color-pink-deep)" : "var(--color-text-soft)",
              fontWeight: !isAdmin ? 600 : 500,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all var(--transition-fast)",
            }}
          >
            <Sparkles size={14} />
            Convite
          </Link>
          <Link
            to="/admin"
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.8125rem",
              borderRadius: "var(--radius-full)",
              backgroundColor: isAdmin ? "var(--color-bg-soft)" : "transparent",
              color: isAdmin ? "var(--color-pink-deep)" : "var(--color-text-soft)",
              fontWeight: isAdmin ? 600 : 500,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "all var(--transition-fast)",
            }}
          >
            <Settings size={14} />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};