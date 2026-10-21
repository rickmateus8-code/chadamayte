import React, { useState } from "react";
import { Lock, Crown, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { adminLogin } from "../../../lib/adminApi";
import { RoyalCornerFiligree, RoyalCrestOrnament } from "../../../components/brand/RoyalOrnaments";

interface AdminLoginProps {
  onSuccess: (token: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await adminLogin(passcode);
    setLoading(false);

    if (res.success && res.token) {
      localStorage.setItem("mayte_admin_token", res.token);
      onSuccess(res.token);
    } else {
      setError(res.message || "Senha incorreta.");
    }
  };

  return (
    <div className="invitation-canvas" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div
        className="floral-welcome-card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          padding: "2.75rem 2.25rem",
          border: "2px solid var(--color-gold)",
          boxShadow: "0 28px 65px rgba(201, 155, 59, 0.24)",
        }}
      >
        <RoyalCornerFiligree position="tl" size={50} />
        <RoyalCornerFiligree position="tr" size={50} />
        <RoyalCornerFiligree position="bl" size={50} />
        <RoyalCornerFiligree position="br" size={50} />

        <RoyalCrestOrnament width={175} />

        <img
          src="/images/mayte-royal-crown.png"
          alt="Coroa Real da Maytê"
          style={{ width: "110px", height: "auto", margin: "0 auto 0.75rem auto", display: "block", filter: "drop-shadow(0 8px 18px rgba(201,155,59,0.3))" }}
        />

        <span className="section-eyebrow" style={{ marginBottom: "4px" }}>
          <Crown size={13} /> Gabinete Real dos Papais
        </span>

        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--color-text)", marginBottom: "0.4rem", marginTop: 0 }}>
          Painel Real da Maytê
        </h1>

        <p style={{ fontSize: "0.88rem", color: "var(--color-text-soft)", marginBottom: "1.5rem" }}>
          Digite a senha real para gerenciar convites, mimos, fotos, perguntas e a fase <strong>"Quando a Maytê Nascer"</strong>.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="royal-input-group">
            <span className="royal-input-icon">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Senha Real dos Papais"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="rsvp-field-input with-icon"
            />
          </div>

          {error && (
            <div className="rsvp-error-banner" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-floral-gold btn-shimmer-gold"
            style={{ width: "100%", padding: "0.95rem" }}
          >
            <Sparkles size={16} />
            <span>{loading ? "Abrindo Gabinete Real..." : "Entrar no Painel Real"}</span>
          </button>
        </form>

        <div style={{ marginTop: "1.25rem" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.82rem",
              color: "var(--color-gold-deep)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Voltar para o Convite da Maytê
          </Link>
        </div>
      </div>
    </div>
  );
};
