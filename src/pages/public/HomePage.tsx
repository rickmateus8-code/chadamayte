import React, { useEffect, useState } from "react";
import { Crown, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchHealth } from "../../lib/api";
import type { HealthResponse } from "../../types";

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
      <div className="card" style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{
          width: "72px",
          height: "72px",
          margin: "0 auto 1.5rem auto",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--color-primary-light), #fff)",
          border: "2px solid var(--color-gold-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-gold)",
          boxShadow: "var(--shadow-sm)",
        }}>
          <Crown size={38} />
        </div>

        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "var(--color-text-main)",
          marginBottom: "0.5rem",
          lineHeight: 1.2,
        }}>
          Chá de Bebê da Maytê
        </h1>

        <p style={{
          fontSize: "1.125rem",
          color: "var(--color-primary-dark)",
          fontWeight: 500,
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}>
          <Heart size={18} fill="var(--color-primary-dark)" />
          Em breve uma experiência mágica e inesquecível
          <Heart size={18} fill="var(--color-primary-dark)" />
        </p>

        <div style={{
          backgroundColor: "var(--color-surface-subtle)",
          borderRadius: "var(--radius-sm)",
          padding: "1rem",
          border: "1px solid var(--color-border)",
          fontSize: "0.875rem",
          textAlign: "left",
          marginTop: "1.5rem",
        }}>
          <div style={{ fontWeight: 600, color: "var(--color-text-main)", marginBottom: "0.5rem" }}>
            Status da Fundação (Fase 0):
          </div>
          {loading && <p style={{ color: "var(--color-text-muted)" }}>Conectando à API...</p>}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626" }}>
              <AlertCircle size={16} />
              <span>Erro de conexão com a API: {error}</span>
            </div>
          )}
          {health && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#16a34a" }}>
                <CheckCircle2 size={16} />
                <span>API Worker operacional ({health.service})</span>
              </div>
              <div style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                Endpoint: <code>/api/health</code> • Status: 200 OK
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
