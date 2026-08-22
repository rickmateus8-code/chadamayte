import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Crown } from "../brand/Crown";
import { ArrowLeft } from "lucide-react";

export const Header: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // On public invitation, do not display a web-app navbar
  if (!isAdmin) {
    return null;
  }

  // Dedicated Admin Header
  return (
    <header style={{
      backgroundColor: "var(--color-surface-card)",
      borderBottom: "1px solid var(--color-border-delicate)",
      padding: "0.75rem 1.5rem",
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-bg-soft)",
            border: "1px solid var(--color-pink-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Crown size={18} color="var(--color-gold)" />
          </div>
          <div>
            <span style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--color-text)",
              lineHeight: 1.1,
              display: "block",
            }}>
              Maytê • Painel Administrativo
            </span>
          </div>
        </div>

        <Link
          to="/"
          style={{
            padding: "0.4rem 0.85rem",
            fontSize: "0.8125rem",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-bg-soft)",
            color: "var(--color-pink-deep)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            transition: "all var(--transition-fast)",
          }}
        >
          <ArrowLeft size={14} />
          Ver Convite Público
        </Link>
      </div>
    </header>
  );
};